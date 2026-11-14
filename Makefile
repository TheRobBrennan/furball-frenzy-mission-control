# Convenience wrapper around docker compose. The only prerequisite is Docker.
# Run `make` with no target to see this list.

COMPOSE := docker compose -f infra/docker-compose.yml

.DEFAULT_GOAL := help
.PHONY: help up up-d down build logs ps test lint

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	  | awk 'BEGIN{FS=":.*?## "}{printf "  \033[1m%-10s\033[0m %s\n", $$1, $$2}'

up:  ## Build and run the web app and the API, Ctrl+C stops
	$(COMPOSE) up --build

up-d:  ## Same as up, in the background
	$(COMPOSE) up --build -d

down:  ## Stop everything
	$(COMPOSE) down

build:  ## Rebuild all images from scratch
	$(COMPOSE) build --no-cache

logs:  ## Tail logs from all running services
	$(COMPOSE) logs -f

ps:  ## Show running services
	$(COMPOSE) ps

test:  ## API tests (native uv) and the web lint and build
	cd apps/api && uv run pytest -q
	cd apps/web && pnpm lint && pnpm build

lint:  ## Ruff for the API, ESLint for the web app
	cd apps/api && uv run ruff check .
	cd apps/web && pnpm lint
