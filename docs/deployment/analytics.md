# Furball Frenzy analytics

Furball production uses [PostHog US Cloud project 768669](https://us.posthog.com/project/768669/home).
The Sploosh.AI website uses project 768515 and has separate events and dashboards.

Set `FURBALL_POSTHOG_TOKEN` in the existing production Compose environment file on the VM,
`/home/furballdeploy/furball-frenzy-mission-control/.env.deploy`, using the write-only project
token from project 768669. The production app deployment rebuilds the web image with it. To
disable collection sitewide, clear this value and run Deploy Production again. Keep the token
out of the repo and use an empty value for local, preview and frozen deployments. The browser
also allows capture only on `furball-frenzy.sploosh.ai`.

Collection defaults to on when configured. The Settings gear switch and `?analytics=off`
save an opt-out; the switch or `?analytics=on` restores the default. Do Not Track still applies.
Page views send an allowlisted path, the production host and a random, in-memory visit ID.
Capture uses the US event endpoint directly, without the browser SDK, a person profile, analytics
cookies, session recording, query strings or a Referer header. Client IP discard is on in
project 768669.

After deploying, verify a fresh production visit appears in the Furball project and not in the
website project. Verify a website visit appears only in the website project. In the browser
network panel, confirm the payload contains the approved fields and no requests go out after
opting out, reloading or navigating. Confirm URL opt-in restores capture. Check the Settings
control at phone width and confirm the frozen site sends nothing.
