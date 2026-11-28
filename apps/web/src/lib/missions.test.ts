import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { missions } from "./missions";

describe("missions", () => {
  it("are numbered in order, and each one has a page", () => {
    expect(missions.map((m) => m.number)).toEqual(missions.map((_, i) => i + 1));
    for (const mission of missions) {
      expect(existsSync(join(process.cwd(), "src/app", mission.href, "page.tsx"))).toBe(true);
      expect(existsSync(join(process.cwd(), "public", mission.image.src))).toBe(true);
    }
  });
});
