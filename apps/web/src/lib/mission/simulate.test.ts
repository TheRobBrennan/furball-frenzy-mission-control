import { describe, expect, it } from "vitest";
import { balanced, dataStarved, empty, overBudget, powerStarved, tooHeavy } from "./designs.fixtures";
import { simulate } from "./simulate";

describe("simulate", () => {
  it("is deterministic, the same design gives the same result", () => {
    expect(simulate(balanced)).toEqual(simulate(balanced));
  });

  it("succeeds with all the science for a balanced design", () => {
    const r = simulate(balanced);
    expect(r.launched).toBe(true);
    expect(r.success).toBe(true);
    expect(r.science).toBe(100);
    expect(r.daysOperating).toBe(14);
    expect(r.biggestLoss).toBeNull();
    expect(r.lossCause).toBeNull();
    expect(r.powerRatio).toBe(1);
    expect(r.dataRatio).toBe(1);
    expect(r.phases.map((p) => p.id)).toEqual(["launch", "transit", "landing", "surface"]);
    expect(r.phases.every((p) => p.ok)).toBe(true);
  });

  it("never leaves the pad when something blocks the launch, and explains why", () => {
    for (const design of [empty, tooHeavy, overBudget]) {
      const r = simulate(design);
      expect(r.launched).toBe(false);
      expect(r.success).toBe(false);
      expect(r.science).toBe(0);
      expect(r.phases).toHaveLength(1);
      expect(r.biggestLoss).toBeTruthy();
      expect(r.lossCause).toBe("launch");
    }
  });

  it("loses the science the antenna cannot send, and blames the antenna", () => {
    const r = simulate(dataStarved);
    expect(r.launched).toBe(true);
    expect(r.success).toBe(false);
    expect(r.science).toBeLessThan(40);
    expect(r.daysOperating).toBe(14);
    expect(r.biggestLoss).toMatch(/antenna/);
    expect(r.lossCause).toBe("data");
    expect(r.dataRatio).toBeLessThan(0.5);
  });

  it("browns out early when the array makes too little power, and blames the array", () => {
    const r = simulate(powerStarved);
    expect(r.launched).toBe(true);
    expect(r.success).toBe(false);
    expect(r.daysOperating).toBeLessThan(14);
    expect(r.phases.at(-1)?.ok).toBe(false);
    expect(r.phases.at(-1)?.note).toMatch(/Brownout/);
    expect(r.biggestLoss).toMatch(/solar array/);
    expect(r.lossCause).toBe("power");
    expect(r.powerRatio).toBeLessThan(0.6);
  });
});
