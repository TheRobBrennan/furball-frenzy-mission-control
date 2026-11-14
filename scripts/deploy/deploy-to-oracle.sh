#!/usr/bin/env bash
#
# Ships this repo to the Oracle Cloud VM and manages its containers there. Everything runs as the
# dedicated `furballdeploy` user, against that user's own rootless Docker daemon, never as root and
# never through the VM's shared Docker daemon (which belongs to other projects).
#
# Usage:
#   ./scripts/deploy/deploy-to-oracle.sh <command> [service]
#
# Commands:
#   sync       Copy code and the tunnel credentials to the VM. Starts and stops nothing.
#   up         sync, then rebuild and (re)create the app. Without a service the tunnel is brought up
#              too, it is only recreated if its config changed, so a routine code deploy leaves it
#              connected. Afterwards prunes untagged images and old build cache.
#   stop       Stop containers, keep them (and their images) on the VM.
#   start      Start stopped containers.
#   restart    Restart containers in place, no rebuild.
#   down       Remove containers and the network (images stay cached).
#   status     Container state on the VM, plus an HTTP check of the public URL.
#   logs       Last 100 lines of logs (add FOLLOW=1 to stream).
#
# service (optional):  app | tunnel, default is both. `app` is web and api together.
#
# Settings come from .env.deploy (see .env.deploy.example): FURBALL_VM_IP, FURBALL_PUBLIC_HOSTNAME,
# TUNNEL_ID. DEPLOY_ENV_FILE points at a different local settings file.
#
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

usage() { sed -n '2,/^set -euo/p' "${BASH_SOURCE[0]}" | sed '$d' | sed 's/^# \{0,1\}//'; }

CMD="${1:-}"
[ -n "$CMD" ] || { usage >&2; exit 1; }
SERVICE_ARG="${2:-}"

ENV_FILE="${DEPLOY_ENV_FILE:-.env.deploy}"
REMOTE_ENV_FILE=".env.deploy"
[ -f "$ENV_FILE" ] || { echo "No $ENV_FILE, copy .env.deploy.example and fill it in." >&2; exit 1; }

# Read with grep rather than sourcing: .env files are not guaranteed to be shell-safe.
env_get() { grep -m1 "^$1=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true; }
HOST="$(env_get FURBALL_VM_IP)"
PUBLIC_HOSTNAME="$(env_get FURBALL_PUBLIC_HOSTNAME)"
[ -n "$HOST" ] || { echo "Set FURBALL_VM_IP in $ENV_FILE." >&2; exit 1; }

KEY="${FURBALL_DEPLOY_KEY:-$HOME/.ssh/furball_oracle_deploy}"
USER_NAME="furballdeploy"
REMOTE_DIR="/home/$USER_NAME/furball-frenzy-mission-control"
[ -f "$KEY" ] || { echo "Missing deploy key at $KEY, see docs/deployment/oracle-vm.md, step 1." >&2; exit 1; }

SSH_OPTS=(-i "$KEY" -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o ConnectTimeout=10)
quiet() { grep -v -i 'post-quantum\|store now\|openssh.com/pq' >&2 || true; }
ssh_vm() { ssh "${SSH_OPTS[@]}" "$USER_NAME@$HOST" "$@" 2> >(quiet); }

# Non-interactive SSH does not read ~/.bashrc, so point the docker CLI at this user's own daemon.
REMOTE_ENV='export XDG_RUNTIME_DIR=/run/user/$(id -u) DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock'
COMPOSE="docker compose -p furball-frenzy-prod --env-file $REMOTE_ENV_FILE \
-f infra/docker-compose.yml -f infra/docker-compose.tunnel.yml --profile tunnel"

case "$SERVICE_ARG" in
  "")     SERVICES="" ;;
  app)    SERVICES="web api" ;;
  tunnel) SERVICES="cloudflared" ;;
  *) echo "Unknown service '$SERVICE_ARG' (use app or tunnel)." >&2; exit 1 ;;
esac

remote() { ssh_vm "$REMOTE_ENV; cd $REMOTE_DIR && $*"; }

do_sync() {
  echo "==> Syncing code to $USER_NAME@$HOST:$REMOTE_DIR (no .git, no node_modules, no secrets)"
  ssh_vm "mkdir -p $REMOTE_DIR/infra/cloudflared"
  rsync -az --delete \
    -e "ssh ${SSH_OPTS[*]}" \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '**/node_modules' \
    --exclude '.next' \
    --exclude '.venv' \
    --exclude '.pytest_cache' \
    --exclude '.ruff_cache' \
    --exclude '.DS_Store' \
    --exclude '.env' \
    --exclude '.env.deploy' \
    --exclude 'infra/cloudflared/credentials.json' \
    ./ "$USER_NAME@$HOST:$REMOTE_DIR/" 2> >(quiet)
  if [ -n "$(env_get TUNNEL_ID)" ]; then
    echo "==> Syncing the compose settings (TUNNEL_ID and TUNNEL_NAME only)"
    tmp_env="$(mktemp)"
    { grep -E '^(TUNNEL_ID|TUNNEL_NAME)=' "$ENV_FILE" || true; } > "$tmp_env"
    scp "${SSH_OPTS[@]}" "$tmp_env" "$USER_NAME@$HOST:$REMOTE_DIR/$REMOTE_ENV_FILE" 2> >(quiet)
    rm -f "$tmp_env"
  else
    # The GitHub Actions deploy has no TUNNEL_ID, it keeps the settings file already on the VM.
    echo "==> $ENV_FILE has no TUNNEL_ID, keeping the settings file already on the VM"
  fi
  if [ -f infra/cloudflared/credentials.json ]; then
    echo "==> Syncing the tunnel credentials (never logged)"
    scp "${SSH_OPTS[@]}" infra/cloudflared/credentials.json "$USER_NAME@$HOST:$REMOTE_DIR/infra/cloudflared/credentials.json" 2> >(quiet)
    ssh_vm "chmod 600 $REMOTE_DIR/infra/cloudflared/credentials.json"
  else
    echo "==> No infra/cloudflared/credentials.json locally, keeping the one already on the VM"
  fi
}

case "$CMD" in
  sync)
    do_sync
    ;;
  up)
    do_sync
    GIT_HASH="$(git rev-parse HEAD)"
    # Shown in the page footer as the deploy time. UTC, the browser shows it in the visitor's zone.
    BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "==> Building and starting ${SERVICE_ARG:-app + tunnel} at ${GIT_HASH:0:7}"
    # Always detached. An attached `docker compose up` over SSH stops every container the moment
    # the session's stdin closes.
    remote "GIT_HASH=$GIT_HASH BUILD_TIME=$BUILD_TIME $COMPOSE up -d --build $SERVICES"
    # Every build leaves old layers and untagged images behind on a disk shared with other
    # projects. Drop the untagged images and keep a 500 MB build cache so the next build stays fast.
    # Never fatal: a failed cleanup must not fail a deploy that already succeeded.
    echo "==> Cleaning up old images and build cache"
    remote "docker image prune -f >/dev/null && docker builder prune -f --reserved-space 500MB | tail -1; df -h / | tail -1" \
      || echo "Cleanup skipped (deploy itself succeeded)."
    ;;
  stop)    remote "$COMPOSE stop $SERVICES" ;;
  start)   remote "$COMPOSE start $SERVICES" ;;
  restart) remote "$COMPOSE restart $SERVICES" ;;
  down)    remote "$COMPOSE down" ;;
  status)
    remote "$COMPOSE ps -a"
    if [ -n "$PUBLIC_HOSTNAME" ]; then
      echo
      code="$(curl -s -o /dev/null --max-time 15 -w '%{http_code}' "https://$PUBLIC_HOSTNAME/" || true)"
      echo "https://$PUBLIC_HOSTNAME/ -> ${code:-000}$([ "${code:-000}" = 000 ] && echo ' (unreachable)')"
    fi
    ;;
  logs)
    remote "$COMPOSE logs --tail 100 ${FOLLOW:+-f} $SERVICES"
    ;;
  -h|--help|help) usage ;;
  *) echo "Unknown command: $CMD" >&2; usage >&2; exit 1 ;;
esac
