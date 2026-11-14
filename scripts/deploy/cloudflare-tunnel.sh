#!/usr/bin/env bash
#
# Creates the Cloudflare Tunnel and its DNS record from the command line, and writes the tunnel
# credentials where the deploy script expects them. Re-runnable: an existing tunnel is reused.
#
# Needs `cloudflared` (brew install cloudflared). The first run opens a browser tab so you can
# authorize it for the account that manages the public hostname's zone. That login
# (~/.cloudflared/furball-frenzy-origincert.pem) can manage every tunnel and DNS record in the
# zone, so it stays on your machine and is never copied to the VM or the repo. The script checks
# that the login is for the right zone before it creates anything.
#
# Usage:
#   ./scripts/deploy/cloudflare-tunnel.sh
#
# Reads TUNNEL_NAME and FURBALL_PUBLIC_HOSTNAME from .env.deploy. Writes TUNNEL_ID to .env.deploy
# and the tunnel's credentials to infra/cloudflared/credentials.json (gitignored, mode 600). The
# credentials file is scoped to this one tunnel, the VM only ever gets that file.
#
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

ENV_FILE=".env.deploy"
[ -f "$ENV_FILE" ] || { echo "No $ENV_FILE, copy .env.deploy.example first." >&2; exit 1; }
command -v cloudflared >/dev/null || { echo "Install cloudflared first: brew install cloudflared" >&2; exit 1; }

env_get() { grep -m1 "^$1=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true; }
NAME="$(env_get TUNNEL_NAME)"; NAME="${NAME:-furball-frenzy}"
HOSTNAME_PUBLIC="$(env_get FURBALL_PUBLIC_HOSTNAME)"
[ -n "$HOSTNAME_PUBLIC" ] || { echo "Set FURBALL_PUBLIC_HOSTNAME in $ENV_FILE." >&2; exit 1; }

# A login for THIS project only. The default ~/.cloudflared/cert.pem may belong to another
# Cloudflare account or zone (an old login, another client), and `route dns` would quietly create
# the tunnel and the DNS record there. A separate file avoids reusing it by accident.
export TUNNEL_ORIGIN_CERT="${FURBALL_CLOUDFLARE_CERT:-$HOME/.cloudflared/furball-frenzy-origincert.pem}"
# Never the default login. cloudflared silently falls back to ~/.cloudflared/cert.pem, which can be a
# login for another account or zone, so a project-specific file is required.
case "$TUNNEL_ORIGIN_CERT" in
  "$HOME/.cloudflared/cert.pem"|"") echo "Refusing to use the default cloudflared login, set FURBALL_CLOUDFLARE_CERT to a project file." >&2; exit 1 ;;
esac
if [ ! -f "$TUNNEL_ORIGIN_CERT" ]; then
  echo "==> Authorizing cloudflared, a browser tab opens. Pick the zone that serves $HOSTNAME_PUBLIC."
  # `cloudflared tunnel login` always writes to $HOME/.cloudflared/cert.pem and refuses to
  # overwrite an existing one, so run it with a scratch HOME and move the result to its own file.
  # That leaves any existing default login untouched.
  scratch="$(mktemp -d)"
  HOME="$scratch" cloudflared tunnel login
  [ -f "$scratch/.cloudflared/cert.pem" ] || { rm -rf "$scratch"; echo "The login did not finish, run this again." >&2; exit 1; }
  install -m 600 "$scratch/.cloudflared/cert.pem" "$TUNNEL_ORIGIN_CERT"
  rm -rf "$scratch"
fi

# Refuse to continue unless the login is for the zone that serves the public hostname. This only
# reads the zone's name, it creates nothing.
ZONE="$(python3 - "$TUNNEL_ORIGIN_CERT" <<'PY'
import re, base64, json, sys, urllib.request
pem = open(sys.argv[1]).read()
m = re.search(r"-----BEGIN ARGO TUNNEL TOKEN-----(.*?)-----END ARGO TUNNEL TOKEN-----", pem, re.S)
d = json.loads(base64.b64decode("".join(m.group(1).split())))
req = urllib.request.Request("https://api.cloudflare.com/client/v4/zones/" + d["zoneID"],
                             headers={"Authorization": "Bearer " + d["apiToken"]})
print(json.load(urllib.request.urlopen(req))["result"]["name"])
PY
)"
case "$HOSTNAME_PUBLIC" in
  *."$ZONE") echo "==> Login is for the zone $ZONE" ;;
  *) echo "The login at $TUNNEL_ORIGIN_CERT is for the zone '$ZONE', but $HOSTNAME_PUBLIC needs its own zone." >&2
     echo "Delete that file and run this again, then pick the right zone in the browser." >&2
     exit 1 ;;
esac

echo "==> Looking for a tunnel named $NAME"
CREATED=0
ID="$(cloudflared tunnel list --name "$NAME" --output json 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin) or []; print(d[0]["id"] if d else "")')"
if [ -z "$ID" ]; then
  echo "==> Creating tunnel $NAME"
  cloudflared tunnel create "$NAME" >/dev/null
  CREATED=1
  ID="$(cloudflared tunnel list --name "$NAME" --output json | python3 -c 'import json,sys; print(json.load(sys.stdin)[0]["id"])')"
else
  echo "==> Tunnel $NAME already exists"
fi

CRED="$HOME/.cloudflared/$ID.json"
[ -f "$CRED" ] || { echo "The tunnel exists but $CRED is not on this machine. Delete the tunnel in the dashboard and re-run, or restore the file." >&2; exit 1; }
mkdir -p infra/cloudflared
install -m 600 "$CRED" infra/cloudflared/credentials.json

echo "==> Routing $HOSTNAME_PUBLIC to the tunnel (DNS record)"
OUT="$(cloudflared tunnel route dns --overwrite-dns "$NAME" "$HOSTNAME_PUBLIC" 2>&1)" || true
printf '%s\n' "$OUT" | grep -v -i 'outdated'
# cloudflared prints the record it created. If the name is not exactly the hostname, the login is for
# a different zone (the zone's name gets appended), so undo what this run created and stop.
if ! printf '%s\n' "$OUT" | grep -q -E "(Added CNAME $HOSTNAME_PUBLIC which|$HOSTNAME_PUBLIC is already configured)"; then
  echo "The DNS record was not created as exactly $HOSTNAME_PUBLIC, this login is for the wrong zone." >&2
  if [ "$CREATED" = 1 ]; then cloudflared tunnel delete "$NAME" >/dev/null 2>&1 && echo "Deleted the tunnel this run created." >&2; fi
  rm -f infra/cloudflared/credentials.json
  echo "A stray DNS record may remain in the other zone, check it in the Cloudflare dashboard." >&2
  exit 1
fi

tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT
grep -v '^TUNNEL_ID=' "$ENV_FILE" > "$tmp" || true
printf 'TUNNEL_ID=%s\n' "$ID" >> "$tmp"
cat "$tmp" > "$ENV_FILE"; chmod 600 "$ENV_FILE"

echo "==> Done. Tunnel $NAME ($ID) routes https://$HOSTNAME_PUBLIC/ to the web container."
echo "    Credentials saved to infra/cloudflared/credentials.json (not committed). Next: npr deploy"
