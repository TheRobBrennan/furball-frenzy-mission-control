# Game plan

A first sketch, written Saturday 2026-11-14 during the Space Apps weekend. Edit freely.

## The challenge

Create an interactive game where a player designs, manages, and simulates a complete
space mission, making engineering decisions, managing limited resources, and seeing how each
choice shapes success. Up to four players may collaborate, single player is allowed.
[Challenge page](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/).

## The idea

A web game anyone can play, starring the furball crew. The Polish elephants dream of
shining in the American Space Program, the player is their mission designer.

### The loop

1. **Pick a mission**: a lunar or Mars mission with an objective (land, drive the rover,
   take samples, relay data).
2. **Build the crew**: assign furballs to roles, planning, spacecraft, science,
   communications, resources. Each has traits.
3. **Design the spacecraft**: structure, power, communications, instruments, the rover.
4. **Choose launch and orbit**: a launch vehicle with payload capacity and cost, a check
   that mass and orbit fit.
5. **Simulate**: step through the mission with events and constraints.
6. **Debrief**: a mission report, a score, and why it succeeded or failed.

### The real trade-offs

Mass, power, budget, data, communications, and mission lifetime, as in the challenge brief.
Simplified models, no claim of flight accuracy.

### The rover

The elephants drive a lunar rover inspired by the PLAYMOBIL ESA Starter Pack Space Mission
(71734). Each kit piece maps to a trade-off:

| Kit piece | In the game | Resource |
| --- | --- | --- |
| Lunar trike with lights and a transport box | The rover, the box carries samples | Mass |
| Solar panel | Powers rover and station | Power |
| Satellite dish and antennas | Sends results to Earth | Communications |
| Small and large display, cable | Mission dashboard | Data |
| 2 rock samples, gripper, examination table | Science payload | Science value |
| Helmet, backpack, oxygen hose | Life support | Mission lifetime |
| ESA astronaut | Astronaut role | Crew |

### The cast

Two groups, both in the game: North Carolina (the Polish elephants, Captain Piggy, Hamley,
Blue Bear, and others) and Seattle WA (Hamlet the drone pilot, Little Bear, Little Bunny,
Kraken Bear, Fuzzy Black Bear, and the lunar rover). More furballs join along the way.
The character notes, traits, and photos live in Rob's vault.

### The setting

- **North Carolina:** the main cast launches from an undisclosed location, the lake right
  out in their backyard.
- **Seattle WA:** the Seattle cast bops around the city between missions, with landmarks as
  places and backdrops: the Space Needle, Pike Place Market, and Climate Pledge Arena, a
  favorite of Kraken Bear.

### Gear and toys

The crew's own gear is a source of parts, vehicles, and mission control hardware for the game:

- **Drones:** the DJI Mini 2 Pro, Air 2S, Avata, and DJI FPV, Hamlet is the experienced pilot and
  the Polish elephants fly along, scouts and aerial survey in the game
- **Radio control trucks:** Slash, a Traxxas 2WD truck and family member the crew acquired on a
  road trip to the Oregon coast, a ground vehicle alongside the lunar rover
- **The 2021 M1 iPad Pro and the 2021 14-inch MacBook Pro:** Mission Control, with Piggy at the helm
- **Remotes:** Piggy ends up with his paws on every remote, learns the buttons, and teaches anyone
  who wants to learn, a tutorial voice for the game, for furballs and humans alike

Piggy and Hamley are brothers, Hamley is the first little brother and looks up to Piggy.

## Architecture

- `apps/api` owns the rules: crew data, parts catalog, launch vehicles, and the mission
  simulation, so the same deterministic simulation can be tested and reused.
- `apps/web` is the game UI: mission builder, simulation view, debrief, the crew pages.
- The web app calls the API through the `/api/*` forward.
- Docker Compose runs both, deployable to the Oracle Cloud VM behind a Cloudflare Tunnel.

## Milestones

1. [x] Repo, Docker, placeholder landing page with the crew
2. [ ] Character data model, traits, and images
3. [ ] Parts catalog and launch vehicles
4. [ ] Mission simulation in the API with tests
5. [ ] Mission builder UI
6. [ ] Simulation view and debrief
7. [ ] Polish: sound, animation, the elephants' story
8. [ ] Deploy to the Oracle Cloud VM
9. [ ] Submit on the Space Apps Project tab, closes Sunday 2026-11-15 11:59pm local time

## References

From the challenge's Resources tab: Design and Develop Science Missions, General Mission
Analysis Tool (GMAT), Concept Maturity Levels, Mission Design Lab, NASA Mission Viz, A
Learning Game About Telescopes, Cubesat 101.
