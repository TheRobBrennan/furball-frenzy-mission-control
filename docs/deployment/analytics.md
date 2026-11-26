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

## Mission launch funnel

Use these six stages in order, leaving out `mission_scene_viewed`, in a PostHog funnel. Apply `mode = manual` to the
insight and hold `builder_id` constant to keep stages from different builders from joining.
Duplicate the insight with `mode = judges` to inspect demo traffic.

| Event | Trigger |
| --- | --- |
| `mission_builder_viewed` | The mission builder opens, or the player enters judges mode |
| `mission_design_started` | First effective edit or first automatic judges pick |
| `mission_launch_eligible` | The design first passes its launch checks |
| `mission_launch_started` | The simulation confirms a launch |
| `mission_scene_viewed` | A story scene starts, with its `scene` name, `position` and `total` |
| `mission_run_finished` | The player completes or skips the playback |
| `mission_debrief_viewed` | The debrief first enters the viewport after an attempt |

Each event has a random builder ID for the current page and mode. Launch, scene, finish, and debrief
events carry a one-based attempt number. Finish carries simulation outcome and playback ending
independently. A skipped story can have a successful simulation.
Finish also carries `story` (`success`, `learned`, `turned_home` or `grounded`), which is how this
run of the story turns out whether or not it was watched, and `last_scene`, the scene on screen when
playback ended. To see which scenes were watched, chart `mission_scene_viewed` broken down by `scene`.
`scene` and `total` come from the story script, so added or removed scenes are reported without an
analytics change. Keep a scene's id stable, renaming it splits its history. The payload contains only
these fields and the existing site metadata. No part selections or free text are sent.

After deploy, run a manual mission and a judges demo, then repeat with analytics off. Check
the event order and fields in the Furball project, and save the manual launch funnel after
confirming that judges traffic stays out of it.
