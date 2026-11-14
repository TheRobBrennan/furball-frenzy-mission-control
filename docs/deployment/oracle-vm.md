# Deploying to the Oracle Cloud VM

**Not done yet.** This is the plan, adapted from the hockey analytics app's
`docs/deployment/oracle-vm.md` and `cloudflare-tunnel.md`, which run on the same Oracle Cloud VM
that hosts CIP. Nothing has been created on the VM or in Cloudflare.

## Decisions made

| Decision | Choice |
| --- | --- |
| Public hostname | `furball-frenzy.sploosh.ai` (2026-11-14, one label deep, covered by Cloudflare's free certificate) |
| Tunnel name | `furball-frenzy` |
| VM user | `furballdeploy`, its own rootless Docker daemon, no sudo, not in the `docker` group |
| Public service | `web` only, the web app forwards `/api/*` to the `api` container on the Docker network, so the API is not exposed separately |
| Host ports | None published in the tunnel overlay, CIP already holds host port 3000 |

If this host ever serves several games, it becomes the hub, or each game gets its own flat
subdomain. A two-label name such as `a.furball-frenzy.sploosh.ai` is not covered by the free
certificate.

## How it fits together

```text
Cloudflare edge  <-- outbound-only connection --  cloudflared (container)
furball-frenzy.sploosh.ai                                  | http://web:3000
                                                           v
                                                  web (Next.js standalone) --/api/*--> api (FastAPI)

   all three run in the `furballdeploy` user's rootless Docker daemon on the VM `sploosh.ai-vm`
```

## One-time setup

1. **Dedicated SSH key:** `ssh-keygen -t ed25519 -f ~/.ssh/furball_oracle_deploy -N ""`, never reuse
   another project's key. Only the `.pub` is committed.
2. **`.env.deploy`** (gitignored): the VM's public IP from the OCI Console, the public hostname, and
   later the tunnel token.
3. **Create the `furballdeploy` user and its Docker daemon**, as `cipdeploy` (passwordless sudo) the
   same way hockey analytics did: create the user, install the key, install `slirp4netns`, enable
   systemd linger, then install rootless Docker as the new user.
4. **Cloudflare Tunnel:** in the Cloudflare dashboard, Networking, Tunnels, create `furball-frenzy`,
   add the public hostname `furball-frenzy.sploosh.ai` pointing at `http://web:3000`, and keep the
   token out of the repo.
5. **Compose tunnel overlay** `infra/docker-compose.tunnel.yml`: adds `cloudflared`, publishes no host
   ports.
6. **Deploy script** `scripts/deploy/deploy-to-oracle.sh`: sync the code, rebuild on the VM, recreate
   the containers detached, check the public site.

## Automatic deploys

After the first manual deploy, add the same flow hockey analytics has in
`.github/workflows/main-merge.yml`:

1. A merge to `main` computes the version bump from the PR title (`feat` is minor, `fix` and the
   rest are patch, `!` is major).
2. It opens a version-bump PR, waits for the checks, and merges it.
3. A `deploy` job installs the deploy key from a GitHub Environment (`furball-frenzy`), runs the
   deploy script, and verifies that the public site returns 200.

The environment holds the secrets `FURBALL_DEPLOY_SSH_KEY` and `FURBALL_VM_IP`. The workflow never
holds the Cloudflare token, it stays in the settings file already on the VM. Add Required
reviewers to the environment if deploys should wait for an approval.

## Before building it

The app should be right locally first, see `docs/roadmap.md`. Then: confirm the VM user name, and
whether to create a new tunnel (recommended) or share one.
