# Cloudflare Tunnel

Publishes the app on the Oracle VM at `https://furball-frenzy.sploosh.ai/` without opening any
inbound port. `cloudflared`, a container next to the app, holds an outbound connection to
Cloudflare, and Cloudflare routes the public hostname down it.

## Hostname

`furball-frenzy.sploosh.ai`, one label deep. `*.sploosh.ai` is covered by Cloudflare's free
Universal SSL certificate, a two-label name such as `web.furball-frenzy.sploosh.ai` is not.

## Scripted

```bash
brew install cloudflared
npr deploy:tunnel
```

The script `scripts/deploy/cloudflare-tunnel.sh`:

1. Runs `cloudflared tunnel login` if needed, saving the login to its own file,
   `~/.cloudflared/furball-frenzy-origincert.pem`. A browser tab opens, sign in with the account
   that manages `sploosh.ai` and pick that zone. This login can manage every tunnel and DNS record
   in the zone, so it stays on your machine. **A separate file matters:** the default
   `~/.cloudflared/cert.pem` may be an old login for another account or zone, and `route dns`
   would create the tunnel and the DNS record there. The script reads the login's zone name first
   and stops unless it matches `sploosh.ai`.
2. Creates the tunnel `furball-frenzy`, or reuses it.
3. Copies the tunnel's credentials file to `infra/cloudflared/credentials.json` (gitignored, mode
   600). This file is scoped to this one tunnel, it is all the VM needs.
4. Creates the DNS record, a CNAME from `furball-frenzy.sploosh.ai` to the tunnel.
5. Writes `TUNNEL_ID` into `.env.deploy`. The id is not a secret.

## By hand

```bash
export TUNNEL_ORIGIN_CERT=~/.cloudflared/furball-frenzy-origincert.pem   # not the default cert.pem
cloudflared tunnel login
cloudflared tunnel create furball-frenzy
cloudflared tunnel route dns furball-frenzy furball-frenzy.sploosh.ai
cp ~/.cloudflared/<tunnel-id>.json infra/cloudflared/credentials.json
chmod 600 infra/cloudflared/credentials.json
echo "TUNNEL_ID=<tunnel-id>" >> .env.deploy
```

Then `npr deploy`. The compose overlay `infra/docker-compose.tunnel.yml` starts `cloudflared` with
this command, no config file needed:

```text
tunnel --no-autoupdate run --credentials-file /etc/cloudflared/credentials.json \
  --url http://web:3000 <tunnel-id>
```

**The service URL is the compose service name, not `localhost`.** `cloudflared` connects from
inside the same Docker network, where `localhost` is the `cloudflared` container itself. If the
`web` service is ever renamed, update the overlay.

## Guardrails, so this cannot hit the wrong account

A first run once created a tunnel and a DNS record in another company's zone, because `cloudflared`
quietly falls back to `~/.cloudflared/cert.pem`, an old login for a different account. Three things
now stop that:

1. **A project login file.** The script uses `~/.cloudflared/furball-frenzy-origincert.pem` and
   refuses to run with the default `cert.pem`.
2. **A zone check before anything is created.** It reads the login's zone name and stops unless the
   public hostname belongs to it.
3. **A check after the DNS step.** cloudflared prints the record it made. If the name is not exactly
   the hostname, the zone name was appended, so the script deletes the tunnel it just created and
   stops.

If you run the commands by hand, set `TUNNEL_ORIGIN_CERT` first and look at the zone in the output of
`cloudflared tunnel route dns`. Check old logins with `ls ~/.cloudflared`, and delete any you no
longer need.

## Check it

```bash
npr deploy:status
cloudflared tunnel info furball-frenzy
```

The dashboard (Networking, Tunnels) shows **Healthy** once the connector is up.

## If something needs to change later

- **Credentials exposed:** delete the tunnel (`cloudflared tunnel delete furball-frenzy`), run
  `npr deploy:tunnel` for a new one, then `npr deploy`.
- **Renaming the hostname:** change `FURBALL_PUBLIC_HOSTNAME` in `.env.deploy`, run
  `npr deploy:tunnel` to move the DNS record.
- **Restricting access** to a preview, an email allowlist for example: Zero Trust, Access
  controls, Applications, Self-hosted, on the same hostname. Optional, the app is public.
- **The dashboard instead of the command line:** create a tunnel there, add a published
  application route to `http://web:3000`, and run the connector with the dashboard's token
  (`tunnel run --token ...`) in place of the credentials file.
