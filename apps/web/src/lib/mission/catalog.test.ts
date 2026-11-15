import { describe, expect, it } from "vitest";
import { commsParts, findPart, findVehicle, instruments, powerParts, scenario, vehicles } from "./catalog";

describe("the catalog", () => {
  it("gives every part and vehicle a unique id", () => {
    const ids = [...instruments, ...powerParts, ...commsParts, ...vehicles].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives instruments data and science, power parts generation, and comms a downlink", () => {
    for (const p of instruments) expect(p.dataMbPerDay! > 0 && p.science! > 0).toBe(true);
    for (const p of powerParts) expect(p.generationW! > 0).toBe(true);
    for (const p of commsParts) expect(p.downlinkMbPerDay! > 0).toBe(true);
  });

  it("finds a part or a vehicle by id, and nothing for an unknown id or null", () => {
    expect(findPart("x-band")?.name).toBe("X-band dish");
    expect(findVehicle("medium")?.capacityKg).toBe(900);
    expect(findPart("nope")).toBeUndefined();
    expect(findPart(null)).toBeUndefined();
    expect(findVehicle(null)).toBeUndefined();
  });

  it("has a scenario with a budget and a mission length", () => {
    expect(scenario.budgetM).toBeGreaterThan(0);
    expect(scenario.daysNeeded).toBe(14);
  });
});
