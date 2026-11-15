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
# The commit and the build time are shown in the page footer, set by the deploy script.
# The PostHog project key is public by design. Leave it empty and analytics stay off and no notice shows.
ARG POSTHOG_KEY=
ARG POSTHOG_HOST=https://us.i.posthog.com
ENV NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$POSTHOG_HOST

# The Flodesk sign-up form link, from Flodesk's Share option. Leave it empty and no sign-up box shows.
ARG FLODESK_FORM_URL=
ENV NEXT_PUBLIC_FLODESK_FORM_URL=$FLODESK_FORM_URL

ARG GIT_HASH=dev
ARG BUILD_TIME=dev
ENV NEXT_PUBLIC_GIT_HASH=$GIT_HASH \
    NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
# Storybook ships with the app at /storybook, on the live site and on the frozen submission copy
RUN pnpm build-storybook && pnpm build

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
