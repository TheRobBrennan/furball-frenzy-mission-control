import type { MissionResult } from "./types";

// The launch is shown as a short sequence: a countdown, liftoff, then each phase of the mission arriving
// with a tick or a cross. This turns a simulation result into timed beats, so the timing can be tested
// without any screen, and the screen only has to play the beats back.

export type Beat =
  | { at: number; kind: "count"; text: string }
  | { at: number; kind: "liftoff" }
  | { at: number; kind: "phase"; label: string; note: string; ok: boolean }
  | { at: number; kind: "end" };

export const COUNT_MS = 700;
export const PHASE_MS = 900;
export const END_PAUSE_MS = 700;

export function launchSequence(result: MissionResult): Beat[] {
  // A design that never left the pad is a scrub: show the reason, then finish.
  if (!result.launched) {
    const p = result.phases[0];
    return [
      { at: 0, kind: "phase", label: p.label, note: p.note, ok: false },
      { at: 1400, kind: "end" },
    ];
  }
  const beats: Beat[] = ["3", "2", "1"].map((text, i) => ({ at: i * COUNT_MS, kind: "count" as const, text }));
  const liftoff = 3 * COUNT_MS;
  beats.push({ at: liftoff, kind: "liftoff" });
  result.phases.forEach((p, i) => beats.push({ at: liftoff + (i + 1) * PHASE_MS, kind: "phase", label: p.label, note: p.note, ok: p.ok }));
  beats.push({ at: liftoff + result.phases.length * PHASE_MS + END_PAUSE_MS, kind: "end" });
  return beats;
}

/** How long the whole sequence runs, in milliseconds. */
export function sequenceLength(result: MissionResult): number {
  return launchSequence(result).at(-1)?.at ?? 0;
}
