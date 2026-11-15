import { choose, emptyDesign, toggleInstrument } from "./design";
import type { Design } from "./types";

// "Judges, start here": the elephants design a good mission by themselves, one part at a time, and launch it.
// It is a list of picks, so the screen only plays it back and the order is easy to test.

export type JudgesPick = { line: string; apply: (d: Design) => Design };

export const judgesPicks: JudgesPick[] = [
  { line: "The Polish elephants pick the medium launcher, strong enough to throw the whole rover to the Moon.", apply: (d) => choose(d, "vehicleId", "medium") },
  { line: "Next, the navigation camera, so the rover can find its way.", apply: (d) => toggleInstrument(d, "nav-cam") },
  { line: "And the spectrometer, to read what the Moon is made of.", apply: (d) => toggleInstrument(d, "spectrometer") },
  { line: "A medium solar array keeps the rover powered all through the lunar day.", apply: (d) => choose(d, "powerId", "solar-medium") },
  { line: "Last, the X-band dish, big enough to send every bit of science home.", apply: (d) => choose(d, "commsId", "x-band") },
];

/** The finished design after every pick. */
export const judgesDesign: Design = judgesPicks.reduce((d, p) => p.apply(d), emptyDesign);

/** How long each pick is on screen before the next one, in milliseconds. */
export const JUDGES_PICK_MS = 2600;
