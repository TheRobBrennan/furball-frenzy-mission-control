// Analytics with consent. PostHog loads only when a project key is set at build time and the visitor has said yes.
// The key is public by design. With no key, nothing here does anything and no notice is shown.

export type Consent = "yes" | "no" | null;
export const CONSENT_KEY = "ff-analytics";

export const analyticsKey = (): string => process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const analyticsHost = (): string => process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: "yes" | "no"): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage is blocked, the notice may come back, which is fine.
  }
}

type Client = { capture: (event: string, props?: Record<string, unknown>) => void };
let client: Client | null = null;

/** Starts PostHog for a visitor who said yes. Typed text is masked in replays, and nothing is autocaptured, only our own events. */
export async function startAnalytics(): Promise<void> {
  const key = analyticsKey();
  if (!key || client) return;
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host: analyticsHost(),
    autocapture: false,
    capture_pageview: true,
    persistence: "localStorage",
    session_recording: { maskAllInputs: true, maskTextSelector: "[data-ph-mask]" },
  });
  client = posthog;
}

/** Records one of our own events, and does nothing unless the visitor said yes and PostHog started. */
export function track(event: string, props?: Record<string, unknown>): void {
  client?.capture(event, props);
}

/** For tests, forgets the client. */
export function resetAnalytics(): void {
  client = null;
}
