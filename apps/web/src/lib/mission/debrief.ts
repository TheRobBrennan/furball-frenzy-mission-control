import { evaluate } from "./evaluate";
import { closestMission, type RealMission } from "./realMissions";
import type { Design, MissionResult } from "./types";

export type Comparison = { mission: RealMission; roverMassKg: number; instruments: number };

/** The real mission a design resembles, with the design's own mass and instrument count for the side by side. */
export function compareToReal(design: Design): Comparison {
  const mass = evaluate(design).gauges.find((g) => g.id === "mass")!.used;
  const instruments = design.instrumentIds.length;
  return { mission: closestMission({ massKg: mass, instruments }), roverMassKg: Math.round(mass), instruments };
}

/** What was left on the table, in plain words: launcher margin, unspent budget, and science that never got home. */
export function leftOnTable(design: Design, result: MissionResult): string[] {
  const g = (id: string) => evaluate(design).gauges.find((x) => x.id === id)!;
  const out: string[] = [];
  const mass = g("mass");
  const budget = g("budget");
  if (mass.limit > 0 && mass.used <= mass.limit && mass.limit - mass.used >= 50) out.push(`${Math.round(mass.limit - mass.used)} kg of launcher margin went unused, room for another instrument.`);
  if (budget.used <= budget.limit && budget.limit - budget.used >= 20) out.push(`$${Math.round(budget.limit - budget.used)}M of the budget stayed unspent.`);
  if (result.launched && result.science < 100) out.push(`${100 - result.science}% of the possible science never made it home.`);
  return out;
}
