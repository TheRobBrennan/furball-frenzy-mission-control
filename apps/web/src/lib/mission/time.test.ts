import { describe, expect, it } from "vitest";
import { formatStamp } from "./time";

const moment = new Date("2026-11-15T17:32:07Z");

describe("formatStamp", () => {
  it("shows the moment in UTC, to the second, with 24 hour time", () => {
    expect(formatStamp(moment).utc).toBe("17:32:07 UTC");
    expect(formatStamp(new Date("2026-11-15T03:04:05Z")).utc).toBe("03:04:05 UTC");
  });

  it("shows the same moment in local time, with the zone", () => {
    expect(formatStamp(moment, "America/New_York").local).toBe("12:32:07 PM EST");
    expect(formatStamp(moment, "America/Los_Angeles").local).toBe("9:32:07 AM PST");
  });

  it("keeps an exact ISO time for machines", () => {
    expect(formatStamp(moment).iso).toBe("2026-11-15T17:32:07.000Z");
  });
});
