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
3. Subdomain: **`furball-frenzy.sploosh.ai`** (recommended, to be confirmed). Alternatives:
   `furballs.sploosh.ai`, `mission-control.sploosh.ai`

## Then: build the game

See `game-plan.md` for the loop and the milestones.

- [ ] Character data model, traits, and images
- [ ] Parts catalog and launch vehicles
- [ ] Mission simulation in the API with tests
- [ ] Mission builder UI
- [ ] Simulation view and debrief
- [ ] Polish, animation, sound, the elephants' story
- [ ] Submit on the Space Apps Project tab, closes Sunday 2026-11-15 at 11:59pm local time

## Ideas to work in

- **The Rockingham crew launches from an undisclosed location**, the lake right out in their
  backyard. The location stays undisclosed, in the game and in the docs.
- **The Seattle crew bops around the city**, Seattle landmarks as places and backdrops: the
  Space Needle, Pike Place Market, and Climate Pledge Arena, a favorite of Kraken Bear.
- Furballs join along the way, more of the Seattle crew, Fuzzy Brown Bear, and others.
