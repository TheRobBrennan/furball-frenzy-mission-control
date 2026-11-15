import { describe, expect, it } from "vitest";
import { compareToReal, closestMission, distance, leftOnTable, realMissions, simulate } from "@/lib/mission";
import { balanced, dataStarved, empty, tooHeavy } from "@/lib/mission/designs.fixtures";

describe("the real missions", () => {
  it("name a NASA source with a link for every mission, and never invent a figure", () => {
    for (const m of realMissions) {
      expect(m.sources.length).toBeGreaterThan(0);
      for (const s of m.sources) expect(s.url).toMatch(/^https:\/\/(science\.nasa\.gov|nssdc\.gsfc\.nasa\.gov)\//);
    }
    // VIPER's page states no mass, so the game says so instead of guessing.
    expect(realMissions.find((m) => m.id === "viper")?.massKg).toBeNull();
  });

  it("finds the closest real mission by mass and instruments, and an unknown mass is never a perfect match", () => {
    expect(closestMission({ massKg: 11, instruments: 3 }).id).toBe("sojourner");
    expect(closestMission({ massKg: 1000, instruments: 8 }).id).toBe("perseverance");
    const viper = realMissions.find((m) => m.id === "viper")!;
    expect(distance(viper, { massKg: 300, instruments: 4 })).toBeGreaterThan(0.5);
  });
});

describe("the debrief comparison", () => {
  it("compares the balanced design to a real rover of a similar size, with its own mass and instrument count", () => {
    const c = compareToReal(balanced);
    expect(c.instruments).toBe(2);
    expect(c.roverMassKg).toBeGreaterThan(150);
    expect(["mer", "lrv", "viper"]).toContain(c.mission.id);
  });

  it("says what was left on the table, launcher margin, budget, and science that never got home", () => {
    const left = leftOnTable(balanced, simulate(balanced)).join(" ");
    expect(left).toMatch(/kg of launcher margin|of the budget stayed unspent/);
    const lost = leftOnTable(dataStarved, simulate(dataStarved)).join(" ");
    expect(lost).toMatch(/of the possible science never made it home/);
  });

  it("has nothing to compare for a design that never launched", () => {
    expect(leftOnTable(tooHeavy, simulate(tooHeavy)).join(" ")).not.toMatch(/science never made it home/);
    expect(() => compareToReal(empty)).not.toThrow();
  });
});
