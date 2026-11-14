# Deploying to the Oracle Cloud VM

**Not done yet.** The plan follows the hockey analytics app's `docs/deployment/oracle-vm.md`,
which runs its production container on the same Oracle Cloud VM that hosts CIP, behind a
Cloudflare Tunnel, under its own VM user and its own rootless Docker daemon.

For this app:

- A new VM user (for example `furballdeploy`) with rootless Docker, no sudo, not in the
  `docker` group, created once from an account that already has sudo.
- The Compose stack in `infra/docker-compose.yml`, plus a tunnel overlay that publishes no
  host port, so it cannot clash with ports CIP or hockey analytics already hold.
- A Cloudflare Tunnel hostname on a `sploosh.ai` subdomain, the tunnel token kept in a
  gitignored `.env.deploy`, never committed.
- Deploys from GitHub Actions or a local deploy script, as in hockey analytics.

Decisions to make before building it: the subdomain, the VM user name, and whether to share
the tunnel with another app or create a new one.
