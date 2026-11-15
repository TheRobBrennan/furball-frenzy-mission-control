import { describe, expect, it } from "vitest";
import { balanced, dataStarved, empty, overBudget, tooHeavy } from "./designs.fixtures";
import { chosenParts, evaluate, totals } from "./evaluate";

const gauge = (design: Parameters<typeof evaluate>[0], id: string) => evaluate(design).gauges.find((g) => g.id === id)!;

describe("totals", () => {
  it("adds the rover, the parts, and the launcher", () => {
    const t = totals(balanced);
    expect(t.massKg).toBe(150 + 2 + 8 + 20 + 9);
    expect(t.demandW).toBe(30 + 5 + 20 + 25);
    expect(t.generationW).toBe(140);
    expect(t.costM).toBe(60 + 8 + 25 + 12 + 20 + 110);
    expect(t.dataMbPerDay).toBe(1200);
    expect(t.downlinkMbPerDay).toBe(2000);
  });

  it("ignores unknown ids and parts of the wrong kind", () => {
    const parts = chosenParts({ instrumentIds: ["nav-cam", "nope", "x-band"], powerId: "uhf", commsId: "solar-small", vehicleId: null });
    expect(parts.instruments.map((p) => p.id)).toEqual(["nav-cam"]);
    expect(parts.power).toBeUndefined();
    expect(parts.comms).toBeUndefined();
  });
});

describe("evaluate", () => {
  it("lets a balanced design launch, with no issues", () => {
    const e = evaluate(balanced);
    expect(e.canLaunch).toBe(true);
    expect(e.issues).toEqual([]);
  });

  it("asks for a vehicle, power, an antenna, and an instrument when none are chosen", () => {
    const codes = evaluate(empty).issues.map((i) => i.code);
    expect(codes).toEqual(["no-vehicle", "no-power", "no-comms", "no-instrument"]);
    expect(evaluate(empty).canLaunch).toBe(false);
  });

  it("locks the launch when the rover is too heavy, and says by how much", () => {
    const e = evaluate(tooHeavy);
    expect(e.canLaunch).toBe(false);
    const issue = e.issues.find((i) => i.code === "too-heavy")!;
    expect(issue.message).toMatch(/\d+ kg too heavy/);
    expect(gauge(tooHeavy, "mass").status).toBe("over");
  });

  it("locks the launch when the mission is over budget", () => {
    expect(evaluate(overBudget).issues.map((i) => i.code)).toContain("over-budget");
    expect(gauge(overBudget, "budget").status).toBe("over");
  });

  it("does not lock the launch for a data shortfall, it only shows the gauge over", () => {
    expect(evaluate(dataStarved).canLaunch).toBe(true);
    expect(gauge(dataStarved, "data").status).toBe("over");
  });

  it("marks a gauge tight when it is within ten percent of its limit", () => {
    const nearly = { instrumentIds: ["nav-cam", "seismometer", "spectrometer", "radar"], powerId: "solar-large", commsId: "ka-band", vehicleId: "small" };
    expect(gauge(nearly, "mass").status).toBe("tight");
  });

  it("reports six gauges", () => {
    expect(evaluate(balanced).gauges.map((g) => g.id)).toEqual(["mass", "power", "budget", "data", "comms", "time"]);
  });
});
