#!/usr/bin/env bash
#
# One-time (re-runnable) setup of the `furballdeploy` user on the Oracle Cloud VM, including its
# own rootless Docker daemon.
#
# Needs a bootstrap admin account on the VM with passwordless sudo, `vmadmin` with its own key
# (~/.ssh/oracle_vm_admin), see docs/deployment/oracle-vm.md. It is never an application's account
# and never another project's deploy key. It is used ONLY here. Everything after this runs as
# `furballdeploy`.
#
# Usage:
#   ./scripts/deploy/provision-vm.sh [PUBLIC_IP] [ADMIN_USER] [ADMIN_KEY]
#
#   PUBLIC_IP   defaults to FURBALL_VM_IP in .env.deploy
#   ADMIN_USER  defaults to vmadmin
#   ADMIN_KEY   defaults to ~/.ssh/oracle_vm_admin
#
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

HOST="${1:-}"
if [ -z "$HOST" ] && [ -f .env.deploy ]; then
  HOST="$(grep -m1 '^FURBALL_VM_IP=' .env.deploy | cut -d= -f2- || true)"
fi
[ -n "$HOST" ] || { echo "Usage: $0 [PUBLIC_IP] [ADMIN_USER] [ADMIN_KEY]  (or set FURBALL_VM_IP in .env.deploy)" >&2; exit 1; }
ADMIN_USER="${2:-vmadmin}"
ADMIN_KEY="${3:-$HOME/.ssh/oracle_vm_admin}"
KEY="$HOME/.ssh/furball_oracle_deploy"
PUBFILE="infra/oracle-cloud/furball_oracle_deploy.pub"

[ -f "$ADMIN_KEY" ] || { echo "Missing admin key at $ADMIN_KEY" >&2; exit 1; }
[ -f "$PUBFILE" ] || { echo "Missing $PUBFILE" >&2; exit 1; }
[ -f "$KEY" ] || { echo "Missing deploy key at $KEY, see docs/deployment/oracle-vm.md, step 1" >&2; exit 1; }

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o BatchMode=yes)

echo "==> Stage 1 (as $ADMIN_USER, with sudo): create furballdeploy, key, linger"
ssh -i "$ADMIN_KEY" "${SSH_OPTS[@]}" "$ADMIN_USER@$HOST" \
  "sudo bash -s -- \"$(cat "$PUBFILE")\"" < infra/oracle-cloud/provision-furballdeploy.sh

echo "==> Stage 2 (as furballdeploy): install rootless Docker and start its daemon"
# A fresh SSH login gives the user a systemd session (XDG_RUNTIME_DIR), which the rootless
# installer needs, `sudo -u` from stage 1 would not.
ssh -i "$KEY" "${SSH_OPTS[@]}" "furballdeploy@$HOST" 'bash -s' <<'REMOTE'
set -euo pipefail
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
if ! systemctl --user is-active --quiet docker; then
  dockerd-rootless-setuptool.sh install
fi
systemctl --user enable --now docker
# Non-interactive SSH commands do not read ~/.bashrc, so scripts always set DOCKER_HOST
# themselves, this is for people who log in and type `docker`.
grep -q 'furballdeploy rootless docker' ~/.bashrc 2>/dev/null || cat >> ~/.bashrc <<'EOF'

# furballdeploy rootless docker
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
EOF
export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
docker version --format 'rootless daemon: {{.Server.Version}} on {{.Server.Os}}/{{.Server.Arch}}'
docker info --format 'security options: {{.SecurityOptions}}'
echo "groups: $(id -nG)"
sudo -n true 2>/dev/null && echo "WARNING: this user has sudo" || echo "sudo: none"
REMOTE

echo "==> Provisioned. Next: npr deploy:tunnel, then npr deploy"
