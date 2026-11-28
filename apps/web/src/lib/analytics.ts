import type { Via } from "./mission/attempts";
import type { DesignChange } from "./mission/changes";

const productionHost = "furball-frenzy.sploosh.ai";
const endpoint = "https://us.i.posthog.com/i/v0/e/";
const preferenceKey = "furball-analytics-off";
const preferenceEvent = "furball-analytics-preference";
const routes = new Set(["/", "/mission", "/missions", "/parade/thanksgiving-2026", "/demo", "/thanks", "/privacy", "/terms"]);
let optedOutInMemory: boolean | undefined;
let visitId: string | undefined;

export function optedOut() {
  try {
    return optedOutInMemory ?? (window.localStorage.getItem(preferenceKey) === "1");
  } catch {
    return optedOutInMemory ?? false;
  }
}

export function setAnalyticsEnabled(enabled: boolean) {
  optedOutInMemory = !enabled;
  try {
    if (enabled) window.localStorage.removeItem(preferenceKey);
    else window.localStorage.setItem(preferenceKey, "1");
    optedOutInMemory = undefined;
  } catch {
    // The in-memory preference still applies if the browser blocks storage.
  }
  if (!enabled) visitId = undefined;
  window.dispatchEvent(new Event(preferenceEvent));
}

export function subscribeToAnalyticsPreference(listener: () => void) {
  window.addEventListener(preferenceEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(preferenceEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

export function capturePageview(pathname: string) {
  if (routes.has(pathname)) capture("$pageview", { $pathname: pathname });
}

type MissionStage =
  | DesignChange
  | { event: "mission_builder_viewed" | "mission_design_started" | "mission_launch_eligible" }
  | { event: "mission_debrief_viewed" | "mission_revision_started" | "mission_design_reset"; attempt: number }
  | { event: "mission_launch_started"; attempt: number; previous_attempt: number; previous_debrief_seen: boolean; via: Via }
  | { event: "mission_reference_opened"; attempt: number; reference: string }
  | { event: "mission_scene_viewed"; attempt: number; scene: string; title: string; position: number; total: number }
  | {
      event: "mission_run_finished";
      attempt: number;
      playback: "completed" | "skipped";
      outcome: "success" | "unsuccessful" | "blocked";
      story: "success" | "learned" | "turned_home" | "grounded";
      last_scene: string;
      science: number;
      days_operating: number;
      loss_cause: "power" | "data" | "launch" | "none";
    };

const repeats = new Set<string>(["mission_part_changed", "mission_limit_changed", "mission_launch_blockers_changed"]);

export function missionFunnel(mode: "manual" | "judges") {
  const builderId = crypto.randomUUID();
  const emitted = new Set<string>();
  return ({ event, ...stage }: MissionStage) => {
    const key = "attempt" in stage ? `${event}:${stage.attempt}:${"scene" in stage ? stage.scene : ""}` : event;
    // Stages are sent once, every edit to the design counts.
    if (!repeats.has(event)) {
      if (emitted.has(key)) return;
      emitted.add(key);
    }
    capture(event, { $pathname: "/mission", builder_id: builderId, mode, ...stage });
  };
}

// PostHog's URL / Screen column shows $current_url, or $screen_name when there is no URL. A scene
// shows its title, everything else a URL built from the allowlisted path, never the address bar.
function place({ title, $pathname }: Record<string, string | number | boolean | undefined>) {
  return title ? { $screen_name: title, title: undefined } : { $current_url: `https://${productionHost}${$pathname}` };
}

type ParadeStage =
  | { event: "parade_started" | "parade_replayed" }
  | { event: "parade_scene_viewed"; scene: string; title: string; position: number; total: number }
  | { event: "parade_finished"; playback: "watched" | "skipped" }
  | { event: "parade_sound_changed"; sound: "on" | "off" }
  | { event: "parade_cheered"; scene: string }
  | { event: "parade_sponsor_opened"; sponsor: "sploosh" | "hockey" };

/** One visit to the parade. A scene counts once per showing, so Back does not inflate it. */
export function paradeFunnel() {
  const showId = crypto.randomUUID();
  let showing = 1;
  const seen = new Set<string>();
  return ({ event, ...stage }: ParadeStage) => {
    if (event === "parade_replayed") {
      showing++;
      seen.clear();
    }
    const key = `${event}:${"scene" in stage ? stage.scene : ""}`;
    if (event === "parade_scene_viewed" || event === "parade_finished" || event === "parade_started") {
      if (seen.has(key)) return;
      seen.add(key);
    }
    capture(event, { $pathname: "/parade/thanksgiving-2026", show_id: showId, showing, ...stage });
  };
}

function capture(event: "$pageview" | MissionStage["event"] | ParadeStage["event"], properties: Record<string, string | number | boolean>) {
  const token = process.env.NEXT_PUBLIC_FURBALL_POSTHOG_TOKEN;
  if (!token || window.location.hostname !== productionHost || optedOut() ||
      navigator.doNotTrack === "1") return;

  visitId ??= crypto.randomUUID();
  void fetch(endpoint, {
    method: "POST",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: token,
      event,
      distinct_id: visitId,
      properties: { ...properties, ...place(properties), $host: productionHost, $process_person_profile: false },
    }),
  }).catch(() => {
    // The game works independently of analytics delivery.
  });
}
