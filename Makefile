# Convenience wrapper around docker compose. The only prerequisite is Docker.
# Run `make` with no target to see this list.

COMPOSE := docker compose -f infra/docker-compose.yml

.DEFAULT_GOAL := help
.PHONY: help up up-d down build clean logs ps test lint

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	  | awk 'BEGIN{FS=":.*?## "}{printf "  \033[1m%-10s\033[0m %s\n", $$1, $$2}'

up:  ## Build and run the web app and the API in the foreground, Ctrl+C stops
	$(COMPOSE) up --build

up-d:  ## Build and run the web app and the API in the background (npr start)
	$(COMPOSE) up --build -d

down:  ## Stop everything
	$(COMPOSE) down

build:  ## Fresh rebuild, all images from scratch (no cache), then start detached
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d --force-recreate

clean:  ## Stop and remove containers, networks, and the images built here (fresh slate)
	$(COMPOSE) down -v --rmi local

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
