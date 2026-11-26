const productionHost = "furball-frenzy.sploosh.ai";
const endpoint = "https://us.i.posthog.com/i/v0/e/";
const preferenceKey = "furball-analytics-off";
const preferenceEvent = "furball-analytics-preference";
const routes = new Set(["/", "/mission", "/demo", "/thanks", "/privacy", "/terms"]);
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
  | { event: "mission_builder_viewed" | "mission_design_started" | "mission_launch_eligible" }
  | { event: "mission_launch_started" | "mission_debrief_viewed"; attempt: number }
  | { event: "mission_scene_viewed"; attempt: number; scene: string; title: string; position: number; total: number }
  | {
      event: "mission_run_finished";
      attempt: number;
      playback: "completed" | "skipped";
      outcome: "success" | "unsuccessful" | "blocked";
      story: "success" | "learned" | "turned_home" | "grounded";
      last_scene: string;
    };

export function missionFunnel(mode: "manual" | "judges") {
  const builderId = crypto.randomUUID();
  const emitted = new Set<string>();
  return ({ event, ...stage }: MissionStage) => {
    const key = "attempt" in stage ? `${event}:${stage.attempt}:${"scene" in stage ? stage.scene : ""}` : event;
    if (emitted.has(key)) return;
    emitted.add(key);
    capture(event, { $pathname: "/mission", builder_id: builderId, mode, ...stage });
  };
}

// PostHog's URL / Screen column shows $current_url, or $screen_name when there is no URL. A scene
// shows its title, everything else a URL built from the allowlisted path, never the address bar.
function place({ title, $pathname }: Record<string, string | number | undefined>) {
  return title ? { $screen_name: title, title: undefined } : { $current_url: `https://${productionHost}${$pathname}` };
}

function capture(event: "$pageview" | MissionStage["event"], properties: Record<string, string | number>) {
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
