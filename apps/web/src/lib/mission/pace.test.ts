import { describe, expect, it } from "vitest";
import { clampSpeed, DEFAULT_SPEED, MAX_SPEED, MIN_SPEED, readSound, readSpeed, scaled, speedLabel } from "./pace";

describe("pace", () => {
  it("defaults to a lazy pace, slower than normal", () => {
    expect(DEFAULT_SPEED).toBeLessThan(1);
    expect(speedLabel(DEFAULT_SPEED)).toBe("Lazy");
    expect(DEFAULT_SPEED).toBe(0.5);
  });

  it("makes things take longer when slower and shorter when faster", () => {
    expect(scaled(3600, 1)).toBe(3600);
    expect(scaled(3600, 0.5)).toBe(7200);
    expect(scaled(3600, 2)).toBe(1800);
    expect(scaled(3600, DEFAULT_SPEED)).toBeGreaterThan(3600);
  });

  it("keeps the speed between the slowest and the fastest", () => {
    expect(clampSpeed(0)).toBe(MIN_SPEED);
    expect(clampSpeed(99)).toBe(MAX_SPEED);
    expect(clampSpeed(0.756)).toBe(0.76);
    expect(clampSpeed(Number.NaN)).toBe(DEFAULT_SPEED);
  });

  it("names the pace", () => {
    expect([0.25, 0.5, 1, 1.5].map(speedLabel)).toEqual(["Very lazy", "Lazy", "Normal", "Quick"]);
  });

  it("reads a saved speed, or the default when there is none or it is nonsense", () => {
    expect(readSpeed("0.5")).toBe(0.5);
    expect(readSpeed("5")).toBe(MAX_SPEED);
    expect(readSpeed(null)).toBe(DEFAULT_SPEED);
    expect(readSpeed("fast")).toBe(DEFAULT_SPEED);
  });

  it("keeps the sound on unless the visitor turned it off", () => {
    expect(readSound(null)).toBe(true);
    expect(readSound("on")).toBe(true);
    expect(readSound("off")).toBe(false);
  });
});
