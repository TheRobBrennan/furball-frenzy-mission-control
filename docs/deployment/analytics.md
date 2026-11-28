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
Events also send `$current_url`, built from that host and path rather than the address bar, which
fills PostHog's URL / Screen column. `mission_scene_viewed` sends the scene's title as
`$screen_name` instead, so that column names the scene. In `posthog-live`, press `c` and add
`$screen_name` to see titles.
Capture uses the US event endpoint directly, without the browser SDK, a person profile, analytics
cookies, session recording, query strings or a Referer header. Client IP discard is on in
project 768669.

After deploying, verify a fresh production visit appears in the Furball project and not in the
website project. Verify a website visit appears only in the website project. In the browser
network panel, confirm the payload contains the approved fields and no requests go out after
opting out, reloading or navigating. Confirm URL opt-in restores capture. Check the Settings
control at phone width and confirm the frozen site sends nothing.

## Watch events live in the terminal

From the repo root, `npm run posthog:live` runs PostHog's
[posthog-live](https://posthog.com/docs/activity#terminal-live-events-posthog-live) viewer. The
first run downloads a pinned, checksum-verified build into `.tools/`. Switch PostHog to the Furball
Frenzy project in your browser, then authorize when it opens. The sign-in is cached for a week in
`~/.posthog/livestream.json`. Pass filters after `--`, for example
`npm run posthog:live -- --event-type mission_scene_viewed,mission_run_finished`.
Inside the viewer, `p` pauses, `f` filters by event, Enter shows an event's details, `q` quits.

## Design edits

Each effective edit sends these, with `builder_id` and `mode`. Values are catalog IDs and fixed codes.

| Event | Properties |
| --- | --- |
| `mission_part_changed` | `category`, `action` (add, remove, replace), `from`, `to`, `restores_launch` (this edit took a locked design to ready) |
| `mission_limit_changed` | `limit` (mass, budget, power, data), `direction`, `blocks_launch` |
| `mission_launch_blockers_changed` | `added`, `cleared`, `remaining` (comma-separated issue codes), `ready` |

Starting over is not an edit. Removing the part that sets a limit is not reported as resolving it.

## Debrief and next attempt

| Event | Trigger and properties |
| --- | --- |
| `mission_revision_started` | "Change one thing", or editing a part under the debrief. `attempt` is the one being revised |
| `mission_design_reset` | "Start over" on the debrief. `attempt` is the one left behind |
| `mission_reference_opened` | A real mission source link is clicked, once per attempt. `attempt`, `reference` (mission name from the game's list) |

`mission_launch_started` also carries `previous_attempt` (0 for the first), `previous_debrief_seen` and `via`
(`first`, `unchanged`, `revision`, `reset`). `mission_run_finished` also carries `science`, `days_operating` and
`loss_cause` (`power`, `data`, `launch`, `none`). Attempt numbers are per `builder_id` and `mode`.

For first versus next attempt, join each launch to the finish with the same `builder_id`, `mode` and `attempt`,
keeping `mode = manual`. A relaunch with `previous_debrief_seen = false` means the player never saw the earlier
result, report it apart from an observed unsuccessful mission.

## Parade Day

| Event | Trigger and properties |
| --- | --- |
| `parade_started` | "Start the parade" |
| `parade_scene_viewed` | A scene appears, once per showing. `scene`, the scene's title as `$screen_name` (the URL / Screen column), `position`, `total` |
| `parade_finished` | The last scene appears. `playback` (`watched`, `skipped`) |
| `parade_replayed` | "Watch again" |
| `parade_sound_changed` | `sound` (`on`, `off`) |
| `parade_cheered` | A tap anywhere that is not a control. `scene`, or `title` before the start |
| `parade_sponsor_opened` | A presenter link. `sponsor` (`sploosh`, `hockey`) |

The Missions page and tab are measured by the `/missions`, `/missions/lunar-south-pole` and `/missions/parade/thanksgiving-2026` page views.

The mission moved from `/mission` to `/missions/lunar-south-pole` on 2026-11-27. Reports filtered on the old path need both.

All carry `show_id` (one page visit) and `showing` (1, then 2 after a replay).

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
| `mission_scene_viewed` | A story scene starts, with its `scene` name, title (`$screen_name`), `position` and `total` |
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
these fields and the existing site metadata. No free text is sent.

After deploy, run a manual mission and a judges demo, then repeat with analytics off. Check
the event order and fields in the Furball project, and save the manual launch funnel after
confirming that judges traffic stays out of it.
