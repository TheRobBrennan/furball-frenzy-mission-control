import { afterEach, describe, expect, it, vi } from "vitest";
import { capturePageview, missionFunnel, setAnalyticsEnabled } from "./analytics";

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
      properties: { $pathname: "/mission", $current_url: "https://furball-frenzy.sploosh.ai/mission", $host: "furball-frenzy.sploosh.ai", $process_person_profile: false },
    });
  });

  it("gives mission events a URL without anything from the address bar", () => {
    const send = setup();
    Object.assign(window.location, { search: "?email=private", hash: "#secret" });
    missionFunnel("manual")({ event: "mission_builder_viewed" });
    expect(JSON.parse(send.mock.calls[0][1].body).properties.$current_url).toBe("https://furball-frenzy.sploosh.ai/mission");
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

  it("keeps manual and judges funnels separate and emits each attempt stage once", () => {
    const send = setup();
    const manual = missionFunnel("manual");
    const judges = missionFunnel("judges");
    manual({ event: "mission_builder_viewed" });
    manual({ event: "mission_builder_viewed" });
    manual({ event: "mission_launch_started", attempt: 1 });
    manual({ event: "mission_launch_started", attempt: 1 });
    manual({ event: "mission_launch_started", attempt: 2 });
    judges({ event: "mission_builder_viewed" });

    const payloads = send.mock.calls.map(([, request]) => JSON.parse(request.body));
    expect(payloads.map((row) => row.event)).toEqual([
      "mission_builder_viewed", "mission_launch_started", "mission_launch_started", "mission_builder_viewed",
    ]);
    expect(payloads[1].properties).toMatchObject({ mode: "manual", attempt: 1, builder_id: payloads[0].properties.builder_id });
    expect(payloads[2].properties).toMatchObject({ mode: "manual", attempt: 2, builder_id: payloads[0].properties.builder_id });
    expect(payloads[3].properties.mode).toBe("judges");
    expect(payloads[3].properties.builder_id).not.toBe(payloads[0].properties.builder_id);
  });

  it("sends each scene once per attempt, and again on a retry", () => {
    const send = setup();
    const track = missionFunnel("manual");
    const view = (attempt: number, scene: string) => track({ event: "mission_scene_viewed", attempt, scene, position: 1, total: 8 });
    view(1, "mission_control");
    view(1, "mission_control");
    view(1, "liftoff");
    view(2, "mission_control");
    expect(send.mock.calls.map(([, request]) => JSON.parse(request.body).properties.scene)).toEqual(["mission_control", "liftoff", "mission_control"]);
  });

  it("honors a mid-mission opt-out without replaying any skipped events", () => {
    const send = setup();
    const track = missionFunnel("manual");
    track({ event: "mission_builder_viewed" });
    setAnalyticsEnabled(false);
    track({ event: "mission_design_started" });
    track({ event: "mission_launch_started", attempt: 1 });
    expect(send).toHaveBeenCalledOnce();

    setAnalyticsEnabled(true);
    track({ event: "mission_design_started" });
    track({ event: "mission_launch_started", attempt: 2 });
    expect(send).toHaveBeenCalledTimes(2);
    const [, request] = send.mock.calls[1];
    expect(JSON.parse(request.body).properties.attempt).toBe(2);
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
