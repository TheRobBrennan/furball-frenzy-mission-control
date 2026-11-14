# Furball Frenzy: Mission Control - project knowledge

## Pitch
A web game anyone can play. Two Polish elephants, small grey plush from a Polish toy label in Software Mansion t-shirts, love the American Space Program, drones, rockets, the Moon, and Mars. Design a space mission (mass, power, budget, data, communications, time, launch vehicle and orbit check) that gets them to the Moon. They drive a lunar rover (PLAYMOBIL Starter Pack Space Mission 71734; the game uses every piece in the kit).

## Event
2026 NASA Space Apps Challenge, Charlotte NC local event, Nov 14-15. Team of one, "Furball Frenzy: Mission Control", with Claude Sonnet 5.5 (Medium) as a valued team member. Theme: whimsy, intrigue, mischief, the furballs and the American Space Program.

## Cast
North Carolina crew:
- Piggy, Captain. Keeps the elephants out of mischief, loves road trips, ends up at the helm of every device and remote. Hamley's big brother.
- The two Polish elephants. Cameras of every kind, satellite imagery, friendly files ("an elephant never forgets"), jamming with Little Bunny on an Ableton Push 3. Classified for fun, never creepy.
- Hamley, pig in the rainbow coat. Flew from England, met Piggy at the Fare Thee Well Grateful Dead shows in Chicago.
- Blue Bear, the newest recruit. The Gray Elephant. The Little Duck (pink rubber duck).
Seattle WA crew (in the game too):
- Hamlet, second Captain, experienced drone pilot, leads the tech charge with the elephants.
- Little Bear, Little Bunny (a she, music and Seahawks fan), Kraken Bear (springs to life at the Kraken goal call), Fuzzy Black Bear (unpictured twin, Fuzzy Brown Bear, may join later).
Fleet at the North Carolina home base: Rocky (Chevy blue truck), a Chevy blue Blazer, a dark blue convertible, an RV, a golf cart. Public text says "a fleet of vehicles and a big property".
Origin: the elephants visited from Poland for a React Native meetup, on a quest for the perfect home, and met their new family in Seattle.

## Decisions
- Hero is a polaroid of the elephants and Hamlet at the American Space Program, phone-first.
- Clearance desk: type 12+ characters to release a classified file, shorter gets a denial quip.
- Subdomain: furball-frenzy.sploosh.ai, later hosting several games.
- Real satellite imagery of the lake is allowed after deployment (public-domain sources like USDA NAIP or USGS lidar preferred), no identifying details.
- Deploy later to an Oracle Cloud VM behind a Cloudflare Tunnel, auto-deploy like the hockey analytics project. Nothing deployed yet.

## Status
Local placeholder site runs in Docker (`npr start`). Landing page, crew roster API, clearance desk, CI, PR template done. Next: the actual mission-design game loop (see docs/game-plan.md and docs/roadmap.md), Rob's house photos for the hero, fleet SVG renditions, classified dossier unlock, deploy.
