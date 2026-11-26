# Production image for the Next.js web app, a standalone server build.
# Pinned to the same Node and pnpm as the repo (.nvmrc, packageManager).
FROM node:26.13.1-bookworm-slim AS deps
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH
# Node 25+ no longer bundles Corepack, install it first
RUN npm install -g corepack && corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# API_URL is baked into the rewrite rules at build time, docker compose passes the api service
ARG API_URL=http://api:8000
ENV API_URL=$API_URL
# The commit and the build time are shown in the page footer, set by the deploy script.
# Optional: another Flodesk form id, or none to hide the sign-up box. Empty uses the default in src/lib/updates.ts.
ARG FLODESK_FORM_ID=
ENV NEXT_PUBLIC_FLODESK_FORM_ID=$FLODESK_FORM_ID

ARG FURBALL_POSTHOG_TOKEN=
ENV NEXT_PUBLIC_FURBALL_POSTHOG_TOKEN=$FURBALL_POSTHOG_TOKEN

ARG GIT_HASH=dev
ARG BUILD_TIME=dev
ENV NEXT_PUBLIC_GIT_HASH=$GIT_HASH \
    NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
# Storybook ships with the app at /storybook, on the live site and on the frozen submission copy
RUN pnpm build-storybook && pnpm build

FROM node:26.13.1-bookworm-slim AS run
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
