import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, readConsent, resetAnalytics, startAnalytics, track, writeConsent } from "./analytics";

const init = vi.fn();
const capture = vi.fn();
vi.mock("posthog-js", () => ({ default: { init: (...a: unknown[]) => init(...a), capture: (...a: unknown[]) => capture(...a) } }));

beforeEach(() => {
  window.localStorage.clear();
  resetAnalytics();
  init.mockClear();
  capture.mockClear();
});
afterEach(() => vi.unstubAllEnvs());

describe("analytics with consent", () => {
  it("reads and writes the visitor's answer, and ignores anything else", () => {
    expect(readConsent()).toBeNull();
    writeConsent("no");
    expect(readConsent()).toBe("no");
    writeConsent("yes");
    expect(readConsent()).toBe("yes");
    window.localStorage.setItem(CONSENT_KEY, "maybe");
    expect(readConsent()).toBeNull();
  });

  it("does nothing without a project key, and records nothing", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    await startAnalytics();
    track("mission_launched");
    expect(init).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });

  it("starts PostHog with typed text masked and no autocapture, then records our own events", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    await startAnalytics();
    expect(init).toHaveBeenCalledTimes(1);
    const options = init.mock.calls[0][1];
    expect(options.autocapture).toBe(false);
    expect(options.session_recording.maskAllInputs).toBe(true);
    track("mission_launched", { success: true });
    expect(capture).toHaveBeenCalledWith("mission_launched", { success: true });
  });

  it("starts only once", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    await startAnalytics();
    await startAnalytics();
    expect(init).toHaveBeenCalledTimes(1);
  });
});
