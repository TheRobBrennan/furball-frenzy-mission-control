import { findPart, findVehicle, scenario } from "./catalog";
import type { Design, Evaluation, Gauge, GaugeStatus, Issue, Part } from "./types";

/** Everything the player picked, resolved against the catalog. Unknown ids are ignored. */
export function chosenParts(design: Design): { instruments: Part[]; power?: Part; comms?: Part } {
  return {
    instruments: design.instrumentIds.map(findPart).filter((p): p is Part => p?.kind === "instrument"),
    power: findPart(design.powerId)?.kind === "power" ? findPart(design.powerId) : undefined,
    comms: findPart(design.commsId)?.kind === "comms" ? findPart(design.commsId) : undefined,
  };
}

function status(used: number, limit: number, tightFrom = 0.9): GaugeStatus {
  if (used > limit) return "over";
  return used >= limit * tightFrom ? "tight" : "ok";
}

/** Totals for the six gauges, shared by the gauges on screen and the simulation. */
export function totals(design: Design) {
  const { instruments, power, comms } = chosenParts(design);
  const vehicle = findVehicle(design.vehicleId);
  const all = [...instruments, ...(power ? [power] : []), ...(comms ? [comms] : [])];
  return {
    massKg: scenario.baseMassKg + all.reduce((n, p) => n + p.massKg, 0),
    capacityKg: vehicle?.capacityKg ?? 0,
    demandW: scenario.basePowerW + all.reduce((n, p) => n + p.powerW, 0),
    generationW: power?.generationW ?? 0,
    costM: scenario.baseCostM + all.reduce((n, p) => n + p.costM, 0) + (vehicle?.costM ?? 0),
    dataMbPerDay: instruments.reduce((n, p) => n + (p.dataMbPerDay ?? 0), 0),
    downlinkMbPerDay: comms?.downlinkMbPerDay ?? 0,
    instrumentCount: instruments.length,
    hasPower: !!power,
    hasComms: !!comms,
    hasVehicle: !!vehicle,
  };
}

/** The six gauges and what, if anything, blocks the launch button. */
export function evaluate(design: Design): Evaluation {
  const t = totals(design);
  const gauges: Gauge[] = [
    { id: "mass", label: "Mass", unit: "kg", used: t.massKg, limit: t.capacityKg, status: t.hasVehicle ? status(t.massKg, t.capacityKg) : "ok" },
    { id: "power", label: "Power", unit: "W", used: t.demandW, limit: t.generationW, status: t.hasPower ? status(t.demandW, t.generationW) : "ok" },
    { id: "budget", label: "Budget", unit: "$M", used: t.costM, limit: scenario.budgetM, status: status(t.costM, scenario.budgetM) },
    { id: "data", label: "Data", unit: "Mb/day", used: t.dataMbPerDay, limit: t.downlinkMbPerDay, status: t.hasComms ? status(t.dataMbPerDay, t.downlinkMbPerDay) : "ok" },
    { id: "comms", label: "Comms", unit: "Mb/day", used: t.downlinkMbPerDay, limit: Math.max(t.downlinkMbPerDay, t.dataMbPerDay), status: "ok" },
    { id: "time", label: "Time", unit: "days", used: scenario.daysNeeded, limit: scenario.daysNeeded, status: "ok" },
  ];
  const issues: Issue[] = [];
  if (!t.hasVehicle) issues.push({ code: "no-vehicle", message: "Pick a launch vehicle." });
  if (!t.hasPower) issues.push({ code: "no-power", message: "The rover needs a power source." });
  if (!t.hasComms) issues.push({ code: "no-comms", message: "The rover needs an antenna to send its results home." });
  if (t.instrumentCount === 0) issues.push({ code: "no-instrument", message: "Pick at least one instrument." });
  if (t.hasVehicle && t.massKg > t.capacityKg) {
    issues.push({ code: "too-heavy", message: `The rover is ${Math.round(t.massKg - t.capacityKg)} kg too heavy for this launcher.` });
  }
  if (t.costM > scenario.budgetM) {
    issues.push({ code: "over-budget", message: `The mission is $${Math.round(t.costM - scenario.budgetM)}M over budget.` });
  }
  return { gauges, issues, canLaunch: issues.length === 0 };
}
