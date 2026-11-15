# Analytics with PostHog

The game can send analytics and session replay to PostHog, but only when two things are true: a PostHog project key was set when the web image was built, and the visitor chose Yes in the notice at the bottom of the page. With no key the notice never shows and nothing loads.

## Turn it on
1. In PostHog, create a project and copy its project API key (it starts with `phc_` and is public by design).
2. Set it where the image is built:
   - Locally: `POSTHOG_KEY=phc_... make build`
   - On the VM: add `POSTHOG_KEY=phc_...` (and `POSTHOG_HOST` for the EU region, `https://eu.i.posthog.com`) to `.env.deploy`, then deploy.
3. Open the site, choose Yes in the notice, and play a mission. A `mission_launched` event and a replay show up in PostHog.

## What is recorded, only after Yes
- Page views, and our own events: `mission_launched` (success, launched, science, loss cause) and `judges_started`.
- Session replay with every input masked. Autocapture is off.
- The answer is stored in the browser as `ff-analytics`, `yes` or `no`.

## Not done yet
The protected dashboard is PostHog's own, sign in there. The Clearance Desk is an input, so it is masked by the replay settings.

## Test the notice
`E2E_ANALYTICS=1 E2E_BASE_URL=http://localhost:3000 pnpm e2e` against a build made with a key.
