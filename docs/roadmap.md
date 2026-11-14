# Roadmap

Written Saturday 2026-11-14, the Space Apps weekend. The order is Rob's.

## Now: get the app running locally and verified

- [x] Repo, Docker, placeholder landing page, GitHub to Discord webhook
- [ ] **Discord:** the repo's GitHub webhook posts to `#concourse-2026`, verified with a real event
- [ ] **`npr` shortcut:** the root `package.json` scripts launch the repo, `npr start` brings up the stack detached, `npr stop` stops it, `npr build` rebuilds from scratch, `npr clean` removes everything built
- [ ] **Manual check:** open the default page, the API, and the API docs, and confirm there are photos that include all the furballs in Rockingham

URLs when the stack is up (`npr start`):

| What | URL |
| --- | --- |
| Web app, the landing page | http://localhost:3000 |
| API health | http://localhost:8000/health |
| API crew | http://localhost:8000/crew |
| API docs | http://localhost:8000/docs |

## Next: deploy

Once the locally running app is right:

1. Deploy to the Oracle Cloud VM, a new VM user with rootless Docker, as in the hockey
   analytics deploy doc (see `deployment/oracle-vm.md`)
2. Configure a Cloudflare Tunnel for a `sploosh.ai` subdomain
3. Subdomain: **`furball-frenzy.sploosh.ai`**, decided 2026-11-14. Keep it simple for now: if the host ever
   serves several games, that host becomes the hub, or each game gets its own flat subdomain
   (a second-level name like `a.b.sploosh.ai` is not covered by Cloudflare's free certificate)
4. Automatic deploys like hockey analytics: after the first manual deploy, a merge to `main`
   bumps the version from the PR title with a version-bump PR, then deploys over SSH to the VM
   and checks the public site (see that repo's `.github/workflows/main-merge.yml`)

## Then: build the game

See `game-plan.md` for the loop and the milestones.

- [ ] Character data model, traits, and images
- [ ] Parts catalog and launch vehicles
- [ ] Mission simulation in the API with tests
- [ ] Mission builder UI
- [ ] Simulation view and debrief
- [ ] Polish, animation, sound, the elephants' story
- [ ] Submit on the Space Apps Project tab, closes Sunday 2026-11-15 at 11:59pm local time

## After deployment: the classified launch site

Eye candy above the fold: classified-looking satellite imagery of the main cast's launch
location in North Carolina. The real place must not be identifiable, the site and the repo are
public.

Guardrails:

- **Never publish real imagery of the actual location.** Use a stand-in: imagery of a different
  lake, a procedurally generated or illustrated "satellite" view, or heavily degraded and
  redacted artwork with CLASSIFIED bars, so nothing matches the real shoreline.
- **No coordinates, labels, street names, or addresses,** and no map tiles or links to a map of
  the place, in the page, the alt text, the filenames, the API, or the git history.
- **Strip metadata** from every image before it is committed (EXIF, GPS, XMP), and check the
  result. Do not commit originals.
- **Do not combine details.** A town name plus the shape of a lake plus a house can identify a
  place, keep the public text at "North Carolina" and "an undisclosed lake".
- A public Git history cannot be unpublished, review each image before the commit, not after.
- Imagery from public sources (NASA Earth Observatory, Landsat, Sentinel) carries credit
  requirements, record the source and licence next to the image.

## Ideas to work in

- **The Rockingham crew launches from an undisclosed location**, the lake right out in their
  backyard. The location stays undisclosed, in the game and in the docs.
- **The Seattle crew bops around the city**, Seattle landmarks as places and backdrops: the
  Space Needle, Pike Place Market, and Climate Pledge Arena, a favorite of Kraken Bear.
- Furballs join along the way, more of the Seattle crew, Fuzzy Brown Bear, and others.
