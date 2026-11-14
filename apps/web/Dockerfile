# Production image for the Next.js web app, a standalone server build.
# Pinned to the same Node and pnpm as the repo (.nvmrc, packageManager).
FROM node:24.17.0-bookworm-slim AS deps
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# API_URL is baked into the rewrite rules at build time, docker compose passes the api service
ARG API_URL=http://api:8000
ENV API_URL=$API_URL
RUN pnpm build

FROM node:24.17.0-bookworm-slim AS run
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
