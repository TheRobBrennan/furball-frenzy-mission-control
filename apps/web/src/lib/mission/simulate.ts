import { scenario } from "./catalog";
import { chosenParts, evaluate, totals } from "./evaluate";
import type { Design, MissionResult, Phase } from "./types";

// Below this share of the power it needs, the rover browns out and shuts down early.
const BROWNOUT_BELOW = 0.6;

/**
 * Runs the mission, phase by phase, and says how it went. Deterministic: the same design always
 * gives the same result. A design that cannot launch returns a result that never left the pad.
 */
export function simulate(design: Design): MissionResult {
  const evaluation = evaluate(design);
  if (!evaluation.canLaunch) {
    return {
      launched: false,
      success: false,
      phases: [{ id: "launch", label: "Launch", ok: false, note: evaluation.issues[0]?.message ?? "Not ready to launch." }],
      science: 0,
      daysOperating: 0,
      biggestLoss: evaluation.issues[0]?.message ?? null,
    };
  }

  const t = totals(design);
  const { instruments } = chosenParts(design);
  const phases: Phase[] = [
    { id: "launch", label: "Launch", ok: true, note: "Liftoff, the rover fits the launcher." },
    { id: "transit", label: "Trip to the Moon", ok: true, note: "Three days of coasting, the elephants watch the Earth shrink." },
    { id: "landing", label: "Landing at the south pole", ok: true, note: "Touchdown near a crater rim in permanent sunlight." },
  ];

  // Power: if the array covers less than the rover needs, instruments are duty-cycled, and below
  // the brownout line the rover shuts down early.
  const powerRatio = Math.min(1, t.generationW / t.demandW);
  const daysOperating = powerRatio >= BROWNOUT_BELOW ? scenario.daysNeeded : Math.floor(scenario.daysNeeded * (powerRatio / BROWNOUT_BELOW));

  // Data: instruments make more than the antenna can send, the rest is lost.
  const dataRatio = t.dataMbPerDay === 0 ? 0 : Math.min(1, t.downlinkMbPerDay / t.dataMbPerDay);

  const possible = instruments.reduce((n, p) => n + (p.science ?? 0), 0);
  const returned = possible * powerRatio * dataRatio * (daysOperating / scenario.daysNeeded);
  const allPossible = Math.max(possible, 1);
  // Score against what this very set of instruments could have returned, so a small cheap rover that
  // works perfectly is not punished for being small.
  const science = Math.round((returned / allPossible) * 100);

  const lossFromPower = 1 - powerRatio * (daysOperating / scenario.daysNeeded);
  const lossFromData = 1 - dataRatio;
  let biggestLoss: string | null = null;
  if (lossFromPower > 0.05 || lossFromData > 0.05) {
    biggestLoss =
      lossFromData >= lossFromPower
        ? `The antenna could send only ${Math.round(t.downlinkMbPerDay)} of the ${Math.round(t.dataMbPerDay)} Mb the instruments made each day, so ${Math.round(lossFromData * 100)}% of the science was lost.`
        : `The solar array made ${Math.round(t.generationW)} W for a rover that needed ${Math.round(t.demandW)} W, so ${Math.round(lossFromPower * 100)}% of the science was lost.`;
  }

  const surviving = daysOperating === scenario.daysNeeded;
  phases.push({
    id: "surface",
    label: "Working on the surface",
    ok: surviving,
    note: surviving
      ? `The rover worked all ${scenario.daysNeeded} days of the lunar day.`
      : `Brownout, the rover shut down after ${daysOperating} of ${scenario.daysNeeded} days.`,
  });

  return { launched: true, success: surviving && science >= 60, phases, science, daysOperating, biggestLoss };
}
