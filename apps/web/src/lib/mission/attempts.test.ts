import { describe, expect, it } from "vitest";
import { attemptLink, nextAttempt } from "./attempts";

describe("attempts", () => {
  it("has nothing to link a first launch to", () => {
    expect(nextAttempt(undefined)).toEqual({ attempt: 1, debriefSeen: false, next: "unchanged" });
    expect(attemptLink(undefined)).toEqual({ previous_attempt: 0, previous_debrief_seen: false, via: "first" });
  });

  it("links a relaunch to the one before, and says how the player got there", () => {
    const first = { ...nextAttempt(undefined), debriefSeen: true, next: "revision" as const };
    expect(attemptLink(first)).toEqual({ previous_attempt: 1, previous_debrief_seen: true, via: "revision" });
    expect(nextAttempt(first)).toEqual({ attempt: 2, debriefSeen: false, next: "unchanged" });
  });
});
