# Deploying to the Oracle Cloud VM

How Furball Frenzy: Mission Control runs on an Oracle Cloud VM at
`https://furball-frenzy.sploosh.ai/`. Every step has a script, and every script has a manual
equivalent below, so anyone can replicate this by hand. Adapted from the hockey analytics
deployment, which runs on the same VM.

## Decisions

| Decision | Choice |
| --- | --- |
| Public hostname | `furball-frenzy.sploosh.ai`, one label deep, covered by Cloudflare's free certificate |
| Tunnel | `furball-frenzy`, created from the command line, see [cloudflare-tunnel.md](cloudflare-tunnel.md) |
| VM user | `furballdeploy`, its own rootless Docker daemon, no sudo, not in the `docker` group, key only |
| Public service | `web` only, it forwards `/api/*` to the `api` container on the Docker network |
| Host ports | None. Other projects hold host ports on the VM, the tunnel reaches `web` by service name |

If this host ever serves several games, it becomes the hub, or each game gets its own flat
subdomain. A two-label name such as `a.furball-frenzy.sploosh.ai` is not covered by the free
certificate.

## How it fits together

```text
Cloudflare edge  <-- outbound-only connection --  cloudflared (container)
furball-frenzy.sploosh.ai                                  | http://web:3000
                                                           v
                                                  web (Next.js standalone) --/api/*--> api (FastAPI)

   all three run in the `furballdeploy` user's rootless Docker daemon on the VM
```

Nothing listens on the VM's public interface for this app. The tunnel is outbound only.

## Why this user is locked down

The `furballdeploy` account exists to launch, restart, and update this app's containers and
nothing else.

- **No sudo, no `docker` group.** Membership in the `docker` group is root-equivalent and would
  expose every other container on the VM.
- **Its own rootless Docker daemon.** Containers run as the unprivileged user, in a user
  namespace. It cannot see or touch another project's containers, images, or volumes.
- **One SSH key, restricted.** The key cannot forward ports, an agent, or X11. The account has a
  locked password, so the key is the only way in.
- **A key just for this project.** Never reuse another project's key. Only the public half is
  committed.
- **The tunnel credentials are scoped to one tunnel.** The broad Cloudflare login stays on your
  machine and is never copied to the VM.

## One-time setup, scripted

```bash
ssh-keygen -t ed25519 -f ~/.ssh/furball_oracle_deploy -N ""
cp ~/.ssh/furball_oracle_deploy.pub infra/oracle-cloud/furball_oracle_deploy.pub
cp .env.deploy.example .env.deploy        # then set FURBALL_VM_IP, from the OCI Console
npr deploy:provision                      # the user and its rootless Docker daemon
npr deploy:tunnel                         # the Cloudflare Tunnel and DNS record
npr deploy                                # build and start everything on the VM
npr deploy:status                         # containers, plus the HTTP status of the public URL
```

`npr deploy:provision` needs a bootstrap admin account on the VM with passwordless sudo,
`vmadmin`, with its own key `~/.ssh/oracle_vm_admin`. It is used only to provision, never by an
app and never shared with another project's deploy key. Create it once per VM:

```bash
# on the VM, as the instance's original admin user or from the OCI Console
sudo useradd -m -s /bin/bash vmadmin
sudo passwd -l vmadmin
echo 'vmadmin ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/vmadmin
sudo chmod 440 /etc/sudoers.d/vmadmin && sudo visudo -c
sudo install -d -m 700 -o vmadmin -g vmadmin /home/vmadmin/.ssh
echo 'ssh-ed25519 AAAA... oracle vm admin bootstrap' | sudo tee /home/vmadmin/.ssh/authorized_keys
sudo chown vmadmin:vmadmin /home/vmadmin/.ssh/authorized_keys && sudo chmod 600 /home/vmadmin/.ssh/authorized_keys
```

Protect the private key with a passphrase and the macOS keychain
(`ssh-keygen -p -f ~/.ssh/oracle_vm_admin`, then `ssh-add --apple-use-keychain ~/.ssh/oracle_vm_admin`).

## One-time setup, by hand

1. **Create the SSH key**, as above. Keep the private key private.
2. **Create the user.** On the VM, as an administrator with sudo:

   ```bash
   sudo useradd -m -s /bin/bash furballdeploy
   sudo passwd -l furballdeploy
   sudo apt-get install -y uidmap slirp4netns dbus-user-session
   sudo loginctl enable-linger furballdeploy
   ```

   `infra/oracle-cloud/provision-furballdeploy.sh` does all of this and also checks the
   `subuid` and `subgid` ranges that rootless Docker needs.
3. **Install the key.** As root, put one line in `/home/furballdeploy/.ssh/authorized_keys` (mode
   600, the `.ssh` directory mode 700, both owned by `furballdeploy`):

   ```text
   no-port-forwarding,no-agent-forwarding,no-X11-forwarding ssh-ed25519 AAAA... furball-frenzy deploy
   ```

4. **Install rootless Docker as the new user.** The Docker packages (`docker-ce-rootless-extras`)
   must already be on the VM. Log in fresh over SSH as `furballdeploy` so the user gets a systemd
   session, then:

   ```bash
   export XDG_RUNTIME_DIR="/run/user/$(id -u)"
   dockerd-rootless-setuptool.sh install
   systemctl --user enable --now docker
   export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
   docker version
   ```

5. **Create the tunnel**, see [cloudflare-tunnel.md](cloudflare-tunnel.md).
6. **Copy the code and start the stack.** From the repo, `npr deploy:sync`, then on the VM as
   `furballdeploy`:

   ```bash
   cd ~/furball-frenzy-mission-control
   docker compose -p furball-frenzy-prod --env-file .env.deploy \
     -f infra/docker-compose.yml -f infra/docker-compose.tunnel.yml \
     --profile tunnel up -d --build
   ```

## Day to day

| Command | What it does |
| --- | --- |
| `npr deploy` | Sync, rebuild, recreate the containers, prune old images |
| `npr deploy:status` | Container state and the HTTP status of the public site |
| `npr deploy:logs` | Last 100 log lines, `FOLLOW=1 npr deploy:logs` streams |
| `npr deploy:restart` | Restart in place, no rebuild |
| `npr deploy:stop` / `npr deploy:start` | Stop or start without removing anything |
| `npr deploy:down` | Remove the containers and network, images stay cached |

Add `app` or `tunnel` to act on one side, for example
`./scripts/deploy/deploy-to-oracle.sh restart tunnel`.

`freeze` and `unfreeze` lock and unlock a stack, `sync` and `up` refuse a frozen one. A second stack,
the frozen judging copy, is just a different settings file (`DEPLOY_ENV_FILE`), with its own stack
name, folder, tunnel, and hostname, see [frozen-release.md](frozen-release.md).

## Troubleshooting

- **`Permission denied (publickey)`:** the deploy key is not the one in `authorized_keys`, or the
  file permissions on the VM are wrong (`.ssh` 700, `authorized_keys` 600).
- **Cannot connect to the Docker daemon:** non-interactive SSH does not read `~/.bashrc`, the
  scripts set `DOCKER_HOST` themselves, a manual session needs the two `export` lines above.
- **`cloudflared` restarts with `permission denied` on `credentials.json`:** the credentials file is
  mode 600 and the image's default user cannot read it. The overlay runs the container as `user: "0:0"`,
  which in a rootless daemon is the deploy user itself, with all capabilities dropped.
- **Containers stopped after a reboot:** check that linger is on, `loginctl show-user
  furballdeploy | grep Linger`.
- **Disk filling up:** `npr deploy` prunes untagged images and trims the build cache. The disk is
  shared with other projects.
- **The VM's IP changed:** the address is not static by default, update `FURBALL_VM_IP`.

## Automatic deploys

A merge to `main` bumps the version, merges the bump, and deploys, with `.github/workflows/main-merge.yml`:

1. **Version bump.** The PR title decides the bump (`feat` is minor, `fix` and the rest are patch,
   `!` is major, see `scripts/ci/classify-pr-title.sh`). The workflow opens a `chore: bump version`
   PR that updates `package.json` and `apps/web/package.json`.
2. **Merge.** It waits for that PR's checks and merges it.
3. **Deploy.** A `deploy` job checks out `main`, installs the deploy key from the `furball-frenzy`
   GitHub Environment, runs `./scripts/deploy/deploy-to-oracle.sh up app`, and checks that the public
   site returns 200. The page footer then shows the new version, the commit, and the release time.

### One-time GitHub setup

1. **Let Actions open the bump PR.** Settings, Actions, General, Workflow permissions, tick *Allow
   GitHub Actions to create and approve pull requests*.
2. **Create the environment** `furball-frenzy` (Settings, Environments) and limit its deployment branches
   to `main`. Add Required reviewers if deploys should wait for an approval.
3. **Add two environment secrets:**
   - `FURBALL_DEPLOY_SSH_KEY`, the contents of `~/.ssh/furball_oracle_deploy`
   - `FURBALL_VM_IP`, the VM's public address

   ```bash
   gh secret set FURBALL_DEPLOY_SSH_KEY --env furball-frenzy < ~/.ssh/furball_oracle_deploy
   gh secret set FURBALL_VM_IP --env furball-frenzy
   ```

The workflow never holds the Cloudflare login or the tunnel credentials, they stay in the files already on
the VM. The deploy key can only act as `furballdeploy`, which has no sudo and its own rootless Docker.

### The footer

The page footer shows `v<version> · <commit> · Released <date and time>`, in the visitor's own time
zone. The version is `package.json`. The commit and the release time are baked in when the web image is
built (`GIT_HASH` and `BUILD_TIME`, set by the deploy script). Local development shows only the version.
