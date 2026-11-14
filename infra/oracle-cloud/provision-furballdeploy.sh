#!/usr/bin/env bash
#
# Runs ON THE VM, as root (via sudo), to create the dedicated `furballdeploy`
# user that owns every container for Furball Frenzy and nothing else.
# Idempotent: safe to re-run.
#
# Run it through scripts/deploy/provision-vm.sh rather than by hand. That
# script ships this file over SSH, then finishes the rootless Docker half as
# the new user.
#
# Usage (on the VM): sudo bash provision-furballdeploy.sh "<ssh public key line>"
#
# What it does:
#   - creates a non-root `furballdeploy` user with NO sudo and NO membership in
#     the `docker` group (that group is root-equivalent and would expose the
#     other projects' containers on the same VM)
#   - gives it one SSH public key, restricted to commands only: no port
#     forwarding, no agent forwarding, no X11 forwarding
#   - makes sure it has a subuid/subgid range, which rootless Docker needs
#   - installs slirp4netns and uidmap, rootless Docker's helpers
#   - turns on systemd "linger" so its user services (the Docker daemon, and
#     through it the containers) start at boot and keep running with nobody
#     logged in
#
set -euo pipefail

USER_NAME="furballdeploy"
PUBKEY="${1:-}"

[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)." >&2; exit 1; }
[ -n "$PUBKEY" ] || { echo "Usage: sudo bash $0 \"<ssh public key line>\"" >&2; exit 1; }
case "$PUBKEY" in ssh-ed25519\ *|ssh-rsa\ *) ;; *) echo "That does not look like a public key line." >&2; exit 1 ;; esac

if id "$USER_NAME" >/dev/null 2>&1; then
  echo "==> $USER_NAME already exists"
else
  echo "==> Creating $USER_NAME"
  useradd -m -s /bin/bash "$USER_NAME"
fi

# A locked password: the account can only be reached with its SSH key.
passwd -l "$USER_NAME" >/dev/null 2>&1 || true

# useradd normally allocates these, verify rather than assume. If missing, take the free range
# right after the highest existing allocation so it never overlaps another user's.
next_range() {
  awk -F: -v n=65536 '{ e=$2+$3; if (e>m) m=e } END { if (m<100000) m=100000; printf "%d-%d", m, m+n-1 }' "$1"
}
if ! grep -q "^$USER_NAME:" /etc/subuid; then
  usermod --add-subuids "$(next_range /etc/subuid)" "$USER_NAME"
fi
if ! grep -q "^$USER_NAME:" /etc/subgid; then
  usermod --add-subgids "$(next_range /etc/subgid)" "$USER_NAME"
fi

echo "==> Installing the SSH key, restricted to commands"
HOME_DIR="$(getent passwd "$USER_NAME" | cut -d: -f6)"
install -d -m 700 -o "$USER_NAME" -g "$USER_NAME" "$HOME_DIR/.ssh"
printf 'no-port-forwarding,no-agent-forwarding,no-X11-forwarding %s\n' "$PUBKEY" > "$HOME_DIR/.ssh/authorized_keys"
chown "$USER_NAME:$USER_NAME" "$HOME_DIR/.ssh/authorized_keys"
chmod 600 "$HOME_DIR/.ssh/authorized_keys"

echo "==> Installing rootless Docker prerequisites"
. /etc/os-release
if [ "$ID" = "ubuntu" ] || [ "$ID" = "debian" ]; then
  apt-get install -y uidmap slirp4netns dbus-user-session
else
  dnf install -y slirp4netns
fi
# The Docker packages (docker-ce-rootless-extras) come from the platform-wide
# Docker install, fail loudly if they are missing.
command -v dockerd-rootless-setuptool.sh >/dev/null 2>&1 \
  || [ -x /usr/bin/dockerd-rootless-setuptool.sh ] \
  || { echo "docker-ce-rootless-extras is not installed on this VM." >&2; exit 1; }

echo "==> Enabling linger so the user's services start at boot"
loginctl enable-linger "$USER_NAME"

echo "==> Done. Next: finish as $USER_NAME (scripts/deploy/provision-vm.sh does this)."
