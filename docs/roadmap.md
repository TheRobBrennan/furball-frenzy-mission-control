# Roadmap

Written Saturday 2026-11-14, the Space Apps weekend, and reviewed Sunday 2026-11-15 morning against what has shipped (live at v0.14.x). The order is Rob's.

## Now: get the app running locally and verified

- [x] Repo, Docker, placeholder landing page, GitHub to Discord webhook
- [ ] **Discord:** the repo's GitHub webhook posts to `#concourse-2026`, verified with a real event. **Not verified:** the webhook is active but its last delivery on 2026-11-15 returned HTTP 400, so check the webhook URL and payload type
- [x] **`npr` shortcut:** the root `package.json` scripts launch the repo, `npr start` brings up the stack detached, `npr stop` stops it, `npr build` rebuilds from scratch, `npr clean` removes everything built
- [x] **Manual check:** open the default page, the API, and the API docs, and confirm there are photos that include all the furballs in North Carolina, rechecked 2026-11-15 on a fresh no-cache build, all four URLs return 200

URLs when the stack is up (`npr start`):

| What | URL |
| --- | --- |
| Web app, the landing page | http://localhost:3000 |
| API health | http://localhost:8000/health |
| API crew | http://localhost:8000/crew |
| API docs | http://localhost:8000/docs |

## Done: deploy

Shipped 2026-11-14. The live site is `https://furball-frenzy.sploosh.ai/`, and every merge to `main` bumps the version and deploys.

1. [x] Deploy to the Oracle Cloud VM, a new VM user with rootless Docker, as in the hockey
   analytics deploy doc (see `deployment/oracle-vm.md`)
2. [x] Configure a Cloudflare Tunnel for a `sploosh.ai` subdomain
3. [x] Subdomain: **`furball-frenzy.sploosh.ai`**, decided 2026-11-14. Keep it simple for now: if the host ever
   serves several games, that host becomes the hub, or each game gets its own flat subdomain
   (a second-level name like `a.b.sploosh.ai` is not covered by Cloudflare's free certificate)
4. [x] Automatic deploys like hockey analytics: a merge to `main` bumps the version from the PR title
   with a version-bump PR, then deploys over SSH to the VM and checks the public site
   (`.github/workflows/main-merge.yml`)
5. [x] **Frozen judging copy**, 2026-11-15: a second stack at
   `furball-frenzy-nasa-space-apps-challenge-2026.sploosh.ai`, built from the git tag
   `nasa-space-apps-2026-submission` by the manual Frozen Release Deploy workflow, never touched by a
   merge to `main`, and locked with `npr deploy:frozen:freeze` once final. See
   `deployment/frozen-release.md`.
   - [ ] Tag the submitted commit and run the workflow, then freeze it, before the submission
   - [ ] Optional: a GitHub tag ruleset on `nasa-space-apps-2026-*` that blocks moving or deleting the tag

## Then: build the game

See `game-plan.md` for the loop and the milestones.

- [x] Character data model, traits, and images, the crew API (`/crew`), the trait ledger (`characters.md`), and the fleet and polaroid art
- [ ] Parts catalog and launch vehicles
- [ ] Mission simulation in the API with tests
- [ ] Mission builder UI
- [ ] Simulation view and debrief
- [ ] Polish, animation, sound, the elephants' story, much of it is on the landing page already (mission menu, sad elephants, Enhance sound, the Zamboni chase), none of it is in the game yet
- [x] A promotional trailer shown as a splash pop-up (shipped 2026-11-15, drawn from the scene art, no video file) toward final submission, phone friendly, closable, respects reduced motion
- [ ] Submit on the Space Apps Project tab, closes Sunday 2026-11-15 at 11:59pm local time, the Team page will not accept a submission after it. Rob is a virtual participant, so local awards and judging do not apply, only the final submission and Global Judging
- The vertical slices to review and build, slice 1 first, are in the vault note for the weekend plan

## After the first game is deployed

Written Sunday 2026-11-15. The first playable slice is one mission, launch to debrief. Fast follows, in Rob's words:

- [ ] **An immersive launch and mission experience**, compelling and a must-watch, building on the countdown and liftoff sequence
- [ ] **Sub-tabs on the sections** for things like the fleet and the crew, as the main navigation

Near submission:

- [x] **Soon: Flodesk email sign-up** (shipped 2026-11-15 with Rob's form, `docs/deployment/flodesk.md`), added 2026-11-15 at Rob's request, sooner rather than later. A friendly "stay updated on the Furball Frenzy and the adventures of the Polish elephants and family" form that adds email addresses to a Flodesk list. Needs a Flodesk account and form (Rob creates those, an embed or form link), then a small sign-up box in the footer and after the debrief, with a consent line, a line on the privacy page, and nothing stored on our side. Public text stays at North Carolina.

- [ ] **Optional user accounts**, persisting data such as saved missions and scores, accounts stay optional
- [x] **PostHog** removed 2026-11-25, the site has no analytics
- [x] **Legal pages** (shipped 2026-11-15) linked from the footer, a privacy policy and terms, public text says North Carolina, no town or address

Proposed enhancements, roughly by payoff against the judging criteria (Impact, Creativity, Validity, Relevance, Presentation):

1. [x] **The debrief that teaches** (slice 2, shipped 2026-11-15, six real missions with figures read from NASA pages, see `apps/web/src/lib/mission/realMissions.ts`): compare a design to real NASA missions with sourced figures and links, the "learn why it worked or failed" part of the brief
2. **Four furballs, four roles** (slice 3): pass-the-binder multiplayer, which the challenge asks for, with crew traits changing the options
3. **A "Judges, start here" button:** one click launches a ready-made mission, with a 30 second autoplay where the elephants design it for you
4. **Dice and mission events** (slice 4): a solar storm or a launch scrub makes margin matter and every run different
5. **Mars as a second scenario** (slice 5): the same parts with a different answer, no single perfect design
6. **The flight, drawn** (slice 7): an animated Earth to Moon trajectory with the sketch-to-color treatment
7. **Unlockable classified dossiers:** earn the elephants' secret files by completing missions
8. **Share a mission link** (slice 6): send a design to a friend to beat
9. **A Polish language toggle:** small, and very on theme for the Polish elephants
10. **Easter egg and unlock: the elephants' S10 dragster.** The furballs found a Chevy S10 at the Rockingham house they want to turn into a dragster, on a Corvette frame, with their own rendering and the Helin Racing livery on purpose. Building it is a quest, unlocked by a first successful mission, and it becomes a racer in the dice-race mini-game (the Micro Machines style race on a tabletop track). Both ideas are in `characters.md`

See the vertical slices note in the vault for the sizes and the order.

## Principle: mobile first

The site must be responsive and mobile-friendly, without question. See `CLAUDE.md`. Tasks:

- [x] Mobile rule in `CLAUDE.md` and `AGENTS.md`, and a PR template that asks for phone-width screenshots
- [x] First check of the landing page at 375 x 812, no horizontal scroll
- [ ] Automated responsive checks (Playwright at 375, 768, and 1280, no horizontal overflow) in CI
- [x] A phone-first redesign of the top of the page, the hero image is visible on the first screen

## Public renditions of the fleet

- [x] Illustrated SVG renditions of Rocky, the Blazer, and the convertible, based on Rob's private
      reference photos. Rocky and the Blazer are Chevy blue, the convertible is dark blue. Only the
      renditions go public, no plates, badges, backgrounds, or metadata. Done, with Big Blue, the golf
      cart, the lunar rover, the Seattle fleet, and the drones alongside, in `apps/web/src/components/fleet`.

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

## Done: a more exciting page above the fold

- [x] Make the top of the page more visually exciting with Rob's own photos from the launch
      site's surroundings, a stronger hero, motion, and mission-patch styling, a rotating polaroid,
      a mission patch, numbered chapters, and a gentle reveal
- The photos are Rob's, review each before the commit, strip metadata, and keep captions and
  filenames free of place names, this stays the rule for every new photo

## Done: the classified launch sites

Shipped 2026-11-14 as the two launch sites, Rockingham, NC and Seattle, WA, each with a recon
polaroid and an Enhance button that zooms one step deeper, a sound, and a flash. The Rockingham recon
is the lake from North Carolina's statewide orthoimagery at about 6 inches per pixel, with a
CLASSIFIED readout and its coordinates withheld. The Seattle recon is Climate Pledge Arena from the
USGS National Map, with its coordinates and a tilt to 3D.

Original plan: classified-looking satellite imagery of the main cast's launch
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

- [x] **The North Carolina crew launches from an undisclosed location**, the lake right out in their
  backyard. The location stays undisclosed, in the game and in the docs.
- [x] **The Seattle crew bops around the city**, Seattle landmarks as places and backdrops: the
  Space Needle, Pike Place Market, and Climate Pledge Arena, a favorite of Kraken Bear.
- Furballs join along the way, more of the Seattle crew, Fuzzy Brown Bear, and others.
- **Mini-game: dice races.** Race the toy fleet Micro Machines style on a tabletop racetrack, rolling
  dice, straight or diagonal, like the Daytona 500 board game. See `characters.md`.
- **Mini-game: drone races** through gates around the launch sites, with B, Optimus, Blades, and Blurr.
- **More recon.** More 3D views, and the elephants' own shots later.
- **The whispering elephants.** One elephant whispers a tip to the other, pointing out features worth
  finding, like Enhance.
- **Quest: build the S10 dragster**, see `characters.md`.
- The Rockingham recon polaroid, the launch sites balanced against each other, and the PLAYMOBIL
  Starter Pack Space Mission 71734, to build the elephants' lunar rover at the house.

## README visuals
- Keep the README exciting off the bat: hero image, phone and desktop screenshots, refreshed with each visual change.
- Add animated GIFs of the game loop (launch, rover drive, clearance desk) as they come to life, keep each under a few MB.

## Operations

Added 2026-11-25, carried over from items 5 to 7 of the `sploosh-ai-web` roadmap.

### Analytics

- [x] PostHog removed 2026-11-25, the site has no analytics

### VM disk

- [ ] Report current disk use on the VM, and **ask Rob before any wider cleanup**
- [ ] If it is tight, grow the boot volume in the OCI Console, then the filesystem
- [ ] Optional: a weekly cleanup timer, once Rob approves running it unattended

### Later

- [x] Uptime monitoring for the live and frozen sites, 2026-11-25: [monitoring and analytics](deployment/monitoring-and-analytics.md)
- [ ] Major dependency upgrades, one PR each (check Next.js support before TypeScript 7)
- [x] Convert any remaining `<img>` tags to `next/image`
- [x] Remove old local branches, after checking they are merged

### Repository links in `package.json`

- [x] Add `repository`, `bugs`, and `homepage` to the root `package.json`, so `npm repo`, `npm bugs`, and
      `npm docs` open the GitHub repo, its issues, and the project page

### Footer version card

- [x] Make the footer version text read like the Hockey Analytics card: `vX.Y.Z`, then
      `Released YYYY.MM.DD @ time` in the visitor's time zone, with a link to the repository

### Separate deploy workflows

- [x] Give deployment its own workflow so each deploy shows as its own run in the Actions list, not as a job
      inside Main Branch Merge. See `sploosh-ai-web` (`deploy-production.yml`) for the pattern
