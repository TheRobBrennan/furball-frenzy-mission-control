# 🐘 Furball Frenzy: Mission Control

A web game for the **2026 NASA Space Apps Challenge**, the *Space Mission Design Game*
challenge, built by a team of one with a crew of plush explorers.

**The true heroes of the game are two space-loving Polish elephants** who want nothing more
than to be part of the American Space Program and to shine as its international members.
Their lifelong dream. Plan a mission from launch to the Moon or Mars, balance mass, power,
budget, data, and communications, and see how every choice shapes the result.

- Team page: <https://www.spaceappschallenge.org/2026/find-a-team/furball-frenzy-mission-control/>
- Challenge: <https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/>
- Game plan: [docs/game-plan.md](docs/game-plan.md)

## Stack

| Part | Tech |
| --- | --- |
| `apps/web` | Next.js, TypeScript, Tailwind, pnpm |
| `apps/api` | FastAPI, uv |
| `infra` | Docker Compose, deployable to an Oracle Cloud VM |

## Run it

Needs Docker.

```bash
make up        # web on http://localhost:3000, api on http://localhost:8000
```

Native dev:

```bash
cd apps/api && uv sync --extra dev && uv run uvicorn app.main:app --reload
cd apps/web && pnpm install && pnpm dev   # forwards /api/* to localhost:8000
```

Tests and lint: `make test`, `make lint`.

## Status

A placeholder landing page introduces the game and the crew, and proves the web app and the
FastAPI backend talk to each other. The game itself is next, see the game plan.

## Credits

- Photos of the furballs by Rob Brennan.
- The lunar rover is inspired by the PLAYMOBIL ESA Starter Pack Space Mission (71734).
- Mission design references from NASA, listed on the challenge's Resources tab.

Built over the Space Apps weekend in Rockingham, NC, with the Charlotte, NC local event.
Released under the [MIT License](LICENSE).
