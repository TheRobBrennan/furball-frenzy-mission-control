# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is

**Furball Frenzy: Mission Control**, a web game built for the 2026 NASA Space Apps
Challenge, the Space Mission Design Game challenge, Charlotte, NC local event. A
team of one (Rob) with a crew of plush explorers. The heroes are two space-loving
Polish elephants whose lifelong dream is to shine as international members of the
American Space Program. Read `README.md` and `docs/game-plan.md`.

```
apps/web    Next.js (App Router, TypeScript, Tailwind), the game UI
apps/api    FastAPI, the game rules, crew data, and mission simulation
infra       docker-compose for web + api
docs        game plan, deployment notes
```

The vault (Rob's Obsidian notes) holds the character notes, the cast with traits and
photos, and the project notes. This repo is the code. Do not duplicate the notes here,
link to them.

## Package managers: pnpm and uv, never npm or pip

- **`apps/web`: pnpm only.** Never run `npm install`, `npm run`, or `npx`. Use `pnpm`,
  `pnpm add`, `pnpm dlx`. Do not add or commit `package-lock.json`.
- **`apps/api`: uv only.** `uv sync`, `uv run ...`. No bare `pip install` or `python -m venv`.
- Next.js here is a recent major version with breaking changes. Read the matching guide in
  `apps/web/node_modules/next/dist/docs/` before writing Next.js code, see `apps/web/AGENTS.md`.

## Commands

```bash
npr start       # build and run web (http://localhost:3000) and api (http://localhost:8000), detached
npr stop        # stop
npr restart     # stop, then start
npr build       # fresh rebuild, no cache, then start detached
npr clean       # remove containers, networks, and the images built here
npr logs        # tail logs
npr ps          # show what is running
npr test        # api tests plus web lint and build
npr lint        # ruff plus eslint
make up         # same as start but in the foreground, Ctrl+C stops

cd apps/api && uv run pytest -q
cd apps/web && pnpm dev       # native dev, set API_URL if the api is not on localhost:8000

cd apps/web && pnpm test            # Vitest unit and component tests, `pnpm test:watch` to watch
cd apps/web && pnpm e2e             # Playwright at 375 and 1280 wide, E2E_BASE_URL=http://localhost:3000 tests a running site
cd apps/web && pnpm storybook       # Storybook on http://localhost:6006
cd apps/web && pnpm build-storybook # static build into public/storybook, served at /storybook
```

Build principles: quality, simplicity, and modularity. Write the tests as you go, in the same PR as the
change: pull logic into small pure modules in `src/lib` with a Vitest test, give new components a story, and
give new flows a Playwright test. Prefer the simple design and no speculative abstractions.

Testing rules: new logic gets a Vitest test, new components get a story, new flows get a Playwright
test. Storybook ships with the app at `/storybook`, on the live site and on the frozen submission copy,
see `docs/deployment/frozen-release.md`.

`npr` is Rob's shell alias for `npm run`. The scripts in the root `package.json` wrap the
Makefile, so `make` works the same way.

The web app forwards `/api/*` to the FastAPI service (`API_URL`, default
`http://localhost:8000`, `http://api:8000` inside Docker).

## Tone

Whimsy, intrigue, and mischief: the furballs and the American Space Program. Warm, playful, and
kind, never creepy. The Polish elephants love cameras, drawings, and all kinds of media, and keep
a few things classified just for the fun of it, they are playful, not sneaky or surveilling.

## Mobile first, always

**The site must be responsive and mobile-friendly, without question.** Rob develops on a
MacBook Pro and it is easy to forget the phone, so mobile stays top of mind on every UI change.

- Design for a phone first (375 x 812), then tablet (768) and desktop (1280 and up).
- No horizontal scroll at any width, no content cut off, tap targets at least 44 px, text readable
  without zooming, images sized with responsive `sizes`, and animations that respect
  `prefers-reduced-motion`.
- **Check every visual change at a phone width** in the running app (`npr start`), for example
  the browser's mobile emulation, not just on the laptop.
- PR screenshots show the phone width as well as the desktop, see the PR template.
- **No decorative chips or pills.** Anything shaped like a button or a chip must link somewhere or do
  something. Plain text labels are fine, fake buttons are not.
- Keep the first screen (above the fold) good on a phone, the hero image and the title come
  first, nothing important hides behind a hover.

## Git workflow

- **Branch naming:** `YYYY.MM.DD/short-kebab-description`, dated the day the branch is
  created, from `date`, never from memory.
- **Never commit directly to `main`.** The one exception is the first scaffold commit. Branch
  off `main`, push, open a PR against `main`.
- **Commits are GPG-signed**, and PR titles are semantic (`feat:`, `fix:`, `docs:`, `chore:`).
  See `CONTRIBUTING.md`.
- Only commit code that has actually been run and verified.
- After merging a PR, delete the branch (remote and local) and pull `main`.

### Visuals in PRs

Every PR that changes something a person can see (UI under `apps/web`, images, docs
layout) needs it shown in the PR description, every time. Screenshot the real running app
(`make up`), link images by commit SHA from `raw.githubusercontent.com`, show before and
after for a change. A change with no visible effect says so in the description.

## Images and credit

Photos of the furballs are Rob's own. The illustration of the Polish elephants and Hamlet at
the American Space Program is an AI-generated image Rob supplied. Do not commit images from
PLAYMOBIL, Target, Walmart, or other brands or retailers to this public repo, link to them
instead. The lunar rover in the game is inspired by the PLAYMOBIL ESA Starter Pack Space
Mission, item 71734, credited in `docs/game-plan.md`.

## Deployment

Live at `https://furball-frenzy.sploosh.ai/`, on Rob's Oracle Cloud VM behind a Cloudflare Tunnel, a
new VM user with rootless Docker, the same pattern as the hockey analytics app. Every merge to
`main` bumps the version from the PR title and deploys. See `docs/deployment/oracle-vm.md`.

A second, frozen copy for the NASA Space Apps review lives at
`https://furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai/`. It is built from the git tag
`nasa-space-apps-2026-submission` by the manual **Frozen Release Deploy** workflow, has its own stack,
tunnel, and folder, is never touched by a merge to `main`, and is locked with `npr deploy:frozen:freeze`
once final. Never deploy to it from `main`, and never unfreeze it without Rob. See
`docs/deployment/frozen-release.md`.

## Notifications

GitHub events post to Discord through a repository webhook, as in the CIP and hockey
analytics repos. The webhook URL is a secret and lives only in the GitHub repo settings.
Never commit it or print it.
