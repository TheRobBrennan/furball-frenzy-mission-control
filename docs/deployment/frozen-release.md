# Frozen release for judging

`furball-frenzy.sploosh.ai` follows `main` and keeps changing. For the NASA Space Apps Challenge
review there is a second, independent copy of the site that is built from a git tag and then locked:

`https://furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai/`

It is one label deep, so Cloudflare's free `*.sploosh.ai` certificate covers it.

## How it is kept apart

| | Live site | Frozen judging copy |
| --- | --- | --- |
| Hostname | `furball-frenzy.sploosh.ai` | `furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai` |
| Built from | `main`, on every merge | the tag `nasa-space-apps-2026-submission` |
| Compose project | `furball-frenzy-prod` | `furball-frenzy-nasa-2026` |
| Folder on the VM | `~/furball-frenzy-mission-control` | `~/furball-frenzy-nasa-2026` |
| Tunnel | `furball-frenzy` | `furball-frenzy-nasa-2026`, its own credentials |
| Deploys | `Main Branch Merge` workflow | `Frozen Release Deploy` workflow, manual only |

The two stacks share nothing but the VM. The tunnels publish no host ports, so they cannot collide.
A merge to `main` never touches the frozen stack, so there is no deploy cutoff to remember.

## The settings file

`.env.deploy.nasa-2026` (gitignored), read by every `npr deploy:frozen*` command:

```text
FURBALL_VM_IP=<same as .env.deploy>
FURBALL_PUBLIC_HOSTNAME=furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai
FURBALL_STACK=furball-frenzy-nasa-2026
FURBALL_REMOTE_DIR_NAME=furball-frenzy-nasa-2026
FURBALL_CRED_FILE=infra/cloudflared/credentials-nasa-2026.json
TUNNEL_NAME=furball-frenzy-nasa-2026
TUNNEL_ID=<written by npr deploy:frozen:tunnel>
```

## One-time setup

```bash
npr deploy:frozen:tunnel    # creates the tunnel and the DNS record, writes TUNNEL_ID
npr deploy:frozen           # first deploy of whatever is checked out
```

The tunnel script uses the project's own login file and stops unless it is for the `sploosh.ai` zone.

## Deploying a release candidate, then freezing

1. Tag the commit: `git tag -a nasa-space-apps-2026-submission -m "..." <sha> && git push origin nasa-space-apps-2026-submission`.
2. Run the **Frozen Release Deploy** workflow (Actions, Run workflow) with that tag. It checks out the
   tag, deploys only the frozen stack, and checks the public URL for a 200.
3. Move the tag and run it again as often as needed before the deadline:
   `git tag -fa ... && git push -f origin <tag>`.
4. When it is final, run the workflow with **freeze** ticked, or `npr deploy:frozen:freeze` from the
   same checkout. A `FROZEN` file with the time and commit lands on the VM.

## What the lock does

While `FROZEN` exists, `sync` and `up` refuse to touch the stack. `rsync` excludes the file, so a sync
can never delete it. `npr deploy:frozen:status` shows it. To change a frozen stack on purpose, run
`npr deploy:frozen:unfreeze`, or set `FORCE_UNFREEZE=1` for a single update.

The page footer shows the commit and build time of what is running, so judges and Rob can both see
exactly which code the frozen copy holds.

## Protecting the tag

A GitHub tag ruleset on `nasa-space-apps-2026-*` that blocks updates and deletion stops the tag from
being moved after the freeze. It is a repository setting, so it is Rob's to turn on.
