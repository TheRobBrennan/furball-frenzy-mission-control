import { afterEach, describe, expect, it, vi } from "vitest";
import { capturePageview, setAnalyticsEnabled } from "./analytics";

afterEach(() => {
  setAnalyticsEnabled(true);
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("page-view capture", () => {
  function setup(hostname = "furball-frenzy.sploosh.ai", token = "test-token", doNotTrack = "0") {
    vi.stubEnv("NEXT_PUBLIC_FURBALL_POSTHOG_TOKEN", token);
    vi.stubGlobal("window", { ...window, location: { hostname }, localStorage: window.localStorage, dispatchEvent: window.dispatchEvent.bind(window) });
    vi.stubGlobal("navigator", { doNotTrack });
    const send = vi.fn().mockResolvedValue(new Response());
    vi.stubGlobal("fetch", send);
    return send;
  }

  it("sends only an anonymous route view by default", () => {
    const send = setup();
    capturePageview("/mission");
    expect(send).toHaveBeenCalledOnce();
    const [endpoint, request] = send.mock.calls[0];
    expect(endpoint).toBe("https://us.i.posthog.com/i/v0/e/");
    expect(request).toMatchObject({ credentials: "omit", referrerPolicy: "no-referrer" });
    expect(JSON.parse(request.body)).toEqual({
      api_key: "test-token",
      event: "$pageview",
      distinct_id: expect.any(String),
      properties: { $pathname: "/mission", $host: "furball-frenzy.sploosh.ai", $process_person_profile: false },
    });
  });

  it("stops sending immediately on opt-out and resumes on opt-in", () => {
    const send = setup();
    setAnalyticsEnabled(false);
    capturePageview("/");
    expect(send).not.toHaveBeenCalled();
    setAnalyticsEnabled(true);
    capturePageview("/");
    expect(send).toHaveBeenCalledOnce();
  });

  it.each([
    ["preview.example.com", "test-token", "0", "/"],
    ["furball-frenzy.sploosh.ai", "", "0", "/"],
    ["furball-frenzy.sploosh.ai", "test-token", "1", "/"],
    ["furball-frenzy.sploosh.ai", "test-token", "0", "/mission?email=private"],
  ])("fails closed outside configured analytics routes", (host, token, dnt, route) => {
    const send = setup(host, token, dnt);
    capturePageview(route);
    expect(send).not.toHaveBeenCalled();
  });
});
