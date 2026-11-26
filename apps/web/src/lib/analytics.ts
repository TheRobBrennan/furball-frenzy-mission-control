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
  const token = process.env.NEXT_PUBLIC_FURBALL_POSTHOG_TOKEN;
  if (!token || window.location.hostname !== productionHost || optedOut() ||
      navigator.doNotTrack === "1" || !routes.has(pathname)) return;

  visitId ??= crypto.randomUUID();
  void fetch(endpoint, {
    method: "POST",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: token,
      event: "$pageview",
      distinct_id: visitId,
      properties: { $pathname: pathname, $host: productionHost, $process_person_profile: false },
    }),
  }).catch(() => {
    // The game works independently of analytics delivery.
  });
}
