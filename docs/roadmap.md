# Roadmap

Written Saturday 2026-11-14, the Space Apps weekend. The order is Rob's.

## Now: get the app running locally and verified

- [x] Repo, Docker, placeholder landing page, GitHub to Discord webhook
- [ ] **Discord:** the repo's GitHub webhook posts to `#concourse-2026`, verified with a real event
- [ ] **`npr` shortcut:** the root `package.json` scripts launch the repo, `npr start` brings up the stack detached, `npr stop` stops it, `npr build` rebuilds from scratch, `npr clean` removes everything built
- [ ] **Manual check:** open the default page, the API, and the API docs, and confirm there are photos that include all the furballs in North Carolina

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

## Principle: mobile first

The site must be responsive and mobile-friendly, without question. See `CLAUDE.md`. Tasks:

- [x] Mobile rule in `CLAUDE.md` and `AGENTS.md`, and a PR template that asks for phone-width screenshots
- [x] First check of the landing page at 375 x 812, no horizontal scroll
- [ ] Automated responsive checks (Playwright at 375, 768, and 1280, no horizontal overflow) in CI
- [ ] A phone-first redesign of the top of the page, the hero image is visible on the first screen

## Public renditions of the fleet

- [ ] Illustrated SVG renditions of Rocky, the Blazer, and the convertible, based on Rob's private
      reference photos. Rocky and the Blazer are Chevy blue, the convertible is dark blue. Only the
      renditions go public, no plates, badges, backgrounds, or metadata.

## Banner image options for the launch site

Rob's decision: obfuscated banner imagery of the actual lake.

- **Rob's own photos of the lake**, cropped and processed so no house, dock, or flag is
  recognizable, metadata stripped.
- **Public-domain aerial imagery**, USDA NAIP, processed with a duotone or grid look and
  CLASSIFIED bars.
- **A 3D render from public lidar**, USGS 3DEP or North Carolina's statewide lidar, as a
  hillshaded or point-cloud "classified" view, generated offline.
- Not for the public site: map or satellite screenshots from consumer map apps, their imagery is
  licensed and they show street names.

## Before the deploy: a more exciting page above the fold

- [ ] Make the top of the page more visually exciting with Rob's own photos from the launch
      site's surroundings, a stronger hero, motion, and mission-patch styling
- [ ] The photos are Rob's, review each before the commit, strip metadata, and keep captions and
      filenames free of place names

## After deployment: the classified launch site

Eye candy above the fold: classified-looking satellite imagery of the main cast's launch
location in North Carolina. Rob's decision (2026-11-14): use actual satellite imagery of the lake,
not a stand-in.

- **Source:** use imagery with a clear licence, such as USDA NAIP aerial imagery, which is public
  domain, or Sentinel-2 or Landsat, and record the source next to the image. Do not copy tiles from
  a commercial map service.
- **Public text stays at "North Carolina" and "an undisclosed lake".** No town, street name,
  address, coordinates, labels, or map links in the page, alt text, filenames, API, or docs.
- **Strip metadata** from every image before it is committed (EXIF, GPS, XMP), and check the
  result. Do not commit originals.
- A public Git history cannot be unpublished, review each image before the commit, not after.

## Imagery from the Chicago shows

A fun bonus for the "How Piggy met Hamley" section: a little imagery from the Fare Thee Well Grateful
Dead concerts at Soldier Field.

- [ ] Rob's own concert photos or ticket stubs from those nights, metadata stripped, reviewed before
      the commit
- [x] An original tie-dye wash in the meantime, no chips, the text already says Fare Thee Well, Soldier Field, and Chicago
- No band logos, official artwork, or posters, they are trademarked and copyrighted, original styling only

## Ideas to work in

- **The North Carolina crew launches from an undisclosed location**, the lake right out in their
  backyard. The location stays undisclosed, in the game and in the docs.
- **The Seattle crew bops around the city**, Seattle landmarks as places and backdrops: the
  Space Needle, Pike Place Market, and Climate Pledge Arena, a favorite of Kraken Bear.
- Furballs join along the way, more of the Seattle crew, Fuzzy Brown Bear, and others.
