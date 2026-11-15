import { describe, expect, it } from "vitest";
import { balanced, powerStarved, tooHeavy } from "./designs.fixtures";
import { launchSequence, sequenceLength } from "./sequence";
import { simulate } from "./simulate";

describe("launchSequence", () => {
  it("counts down 3, 2, 1, then lifts off", () => {
    const beats = launchSequence(simulate(balanced));
    expect(beats.slice(0, 4).map((b) => (b.kind === "count" ? b.text : b.kind))).toEqual(["3", "2", "1", "liftoff"]);
  });

  it("has one beat for each phase, in order, then ends", () => {
    const result = simulate(balanced);
    const beats = launchSequence(result);
    const phases = beats.filter((b) => b.kind === "phase");
    expect(phases).toHaveLength(result.phases.length);
    expect(beats.at(-1)?.kind).toBe("end");
  });

  it("keeps the beats in time order", () => {
    const times = launchSequence(simulate(balanced)).map((b) => b.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("marks a failed phase as not ok", () => {
    const beats = launchSequence(simulate(powerStarved));
    const surface = beats.filter((b) => b.kind === "phase").at(-1);
    expect(surface && surface.kind === "phase" && surface.ok).toBe(false);
  });

  it("is a short scrub for a design that never left the pad", () => {
    const beats = launchSequence(simulate(tooHeavy));
    expect(beats.map((b) => b.kind)).toEqual(["phase", "end"]);
    expect(sequenceLength(simulate(tooHeavy))).toBeLessThan(2000);
  });

  it("runs under seven seconds for a full mission", () => {
    expect(sequenceLength(simulate(balanced))).toBeLessThan(7000);
  });
});
