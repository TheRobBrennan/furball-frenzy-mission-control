import { evaluate } from "./evaluate";
import type { Design, IssueCode, MissionResult } from "./types";

// The mission, told by the furballs. This turns a simulation result into scenes, who says what in each
// one, and the learning point when something went wrong. It is pure, so the story can be tested without
// a screen, and the screen only plays it back.

export type Who = "piggy" | "elephants" | "gray-elephant" | "hamley" | "blue-bear" | "little-bear" | "little-duck";
export type SceneKind = "control" | "liftoff" | "transit" | "landing" | "emergency" | "surface" | "joyride" | "splashdown" | "recovery" | "wrap";
export type Mood = "cheer" | "worry" | "learn";
/** A sound effect that plays as a line appears: the buzzer, the wrench, or the cheer after a fix. */
export type Fx = "nogo" | "wrench" | "fixed" | "alarm" | "sad";
export type Line = { who: Who; text: string; fx?: Fx };
/** One system at Mission Control. The line numbers say when it reports no-go, starts the fix, and is go. */
export type Check = { who: Who; label: string; goLine: number; noGoLine?: number; fixLine?: number };
export type Lesson = { title: string; text: string };
export type Scene = {
  id: string;
  kind: SceneKind;
  title: string;
  mood: Mood;
  /** False when something went wrong in this scene. */
  ok: boolean;
  /** How long the scene plays before the next one, in milliseconds. The last scene waits for the visitor. */
  ms: number;
  lines: Line[];
  /** Who is on screen. Defaults to whoever speaks in the scene. */
  present?: Who[];
  lesson?: Lesson;
  /** For the surface scene, how thick the data beam home is, 0 to 1. */
  beam?: number;
  /** For the recovery scene, everyone who is safe back home. */
  headcount?: Who[];
  /** For Mission Control, the systems each crew member confirms. The countdown waits until every one is checked. */
  checks?: Check[];
  /** True when the scene ends in the 3, 2, 1, liftoff countdown, which starts once every check is in. */
  countdown?: boolean;
  /** The word that ends the countdown. Defaults to LIFTOFF, and SPLASH ends the one before splashdown. */
  countWord?: string;
  /** Piggy's iPad with the photo of the Polish elephants: tearful in trouble, smiling once it is over. */
  photo?: "sad" | "happy";
};

export const names: Record<Who, string> = {
  piggy: "Piggy",
  elephants: "The Polish elephants",
  "gray-elephant": "The Gray Elephant",
  hamley: "Hamley",
  "blue-bear": "Blue Bear",
  "little-bear": "Little Bear",
  "little-duck": "Little Duck",
};

const lessons: Record<"power" | "data" | "success" | IssueCode, Lesson> = {
  power: {
    title: "Power is a budget",
    text: "A rover can only do what its solar array can pay for. When the array makes less than the rover needs, instruments get switched off, and below about 60 percent the rover shuts down early. Pick a bigger array, or fewer power-hungry instruments.",
  },
  data: {
    title: "Science only counts when it gets home",
    text: "The instruments made more data than the antenna could send, so the rest was lost. Match the antenna to what the instruments make, or pick instruments that make less.",
  },
  "too-heavy": {
    title: "Mass is the first limit",
    text: "A launcher can only throw so many kilograms to the Moon, so every kilogram on the rover has to earn its place. Pick a bigger launcher, or a lighter rover.",
  },
  "over-budget": {
    title: "Money is a limit too",
    text: "A bigger launcher can eat most of the budget. Every dollar spent on the ride is a dollar not spent on science.",
  },
  "no-vehicle": { title: "Every mission needs a ride", text: "Without a launcher the rover never leaves the ground. Pick one that can throw the rover to the Moon." },
  "no-power": { title: "Every rover needs power", text: "Without a solar array the rover has nothing to run on. Pick one that makes enough power for what you carry." },
  "no-comms": { title: "Every rover needs to phone home", text: "Without an antenna the science stays on the Moon. Pick one that can send what the instruments make." },
  "no-instrument": { title: "A rover needs something to measure", text: "Without an instrument there is no science to bring home. Pick at least one." },
  success: {
    title: "What worked",
    text: "You matched the launcher, the power, and the antenna to what the instruments needed, so nothing was wasted. Try a cheaper or lighter design next, there is no single perfect one.",
  },
};

/** The whole North Carolina crew, who are all on screen when the mission begins and when it ends well. */
export const NC_CREW: Who[] = ["piggy", "elephants", "gray-elephant", "hamley", "blue-bear", "little-duck"];

/** How long a line needs on screen to be read at normal speed, about 200 words a minute, with a pause either side. */
export const lineMs = (text: string): number => Math.max(2400, 1000 + 60 * text.length);

/** When each line of a scene appears, in milliseconds from the start of the scene, at normal speed. */
export function lineStarts(lines: Line[]): number[] {
  let t = 1200; // a quiet beat before the first line
  return lines.map((l) => {
    const at = t;
    t += lineMs(l.text);
    return at;
  });
}

/** How long it takes to read all the lines of a scene, so a scene never ends before its last line is readable. */
const readingMs = (lines: Line[]): number => lineStarts(lines).at(-1)! + lineMs(lines.at(-1)!.text) + 600;

export const PLAY_MS = { control: 3600, liftoff: 3600, transit: 3400, landing: 3400, surface: 4400, joyride: 4800, splashdown: 4400, recovery: 4800 } as const;

/** The countdown, 3, 2, 1, then LIFTOFF, a beat apart, and a hold after the word. */
export const COUNT_STEP_MS = 700;
const COUNTDOWN_MS = 3 * COUNT_STEP_MS + 1500;

/** When the countdown starts: only after the last line, the all clear, has been read. */
export const countdownStart = (scene: Scene): number => readingMs(scene.lines) - 600;

/** Gives every scene that plays by itself at least the time it takes to read its lines, and a countdown scene the countdown too. */
function withReadingTime(scenes: Scene[]): Scene[] {
  return scenes.map((sc) => (sc.ms > 0 ? { ...sc, ms: Math.max(sc.ms, readingMs(sc.lines) + (sc.countdown ? COUNTDOWN_MS : 0)) } : sc));
}

const systems: { who: Who; label: string; go: string; problem: string; fix: string }[] = [
  { who: "elephants", label: "Rover", go: "Rover checked, helmet shared, we are go.", problem: "No-go! A rover wheel is wobbling.", fix: "Tightened every bolt on the wheel, rover is go again!" },
  { who: "gray-elephant", label: "Ground station", go: "Ground station is ready, everything is green.", problem: "No-go! The dish is pointing the wrong way.", fix: "Dish turned and locked on, ground station is go again!" },
  { who: "hamley", label: "Comms", go: "Comms are live and clear, we are go.", problem: "No-go! I hear nothing but static.", fix: "Swapped the antenna cable, comms are go again!" },
  { who: "blue-bear", label: "Power", go: "Solar array is stowed and charged, power is go.", problem: "No-go! A solar panel latch is stuck.", fix: "Latch freed and locked, power is go again!" },
  { who: "little-duck", label: "Instruments", go: "Instruments are checked, science is go!", problem: "No-go! The camera lens is smudged.", fix: "Wiped the lens clean, instruments are go again!" },
];

/** How often a mission has a surprise no-go at the final checks. */
export const HOLD_CHANCE = 0.4;

/** Picks, at random, whether a system reports no-go in the final checks, and which one. Pure given the dice. */
export function chooseHold(random: () => number = Math.random): number | undefined {
  return random() < HOLD_CHANCE ? Math.min(systems.length - 1, Math.floor(random() * systems.length)) : undefined;
}

/** The final checks: every system calls in, and one may report no-go, get fixed, and call in again. */
function finalChecks(hold?: number): { lines: Line[]; checks: Check[] } {
  const lines: Line[] = [{ who: "piggy", text: "Mission Control is go. Final checks, everybody. Call out your systems!" }];
  const checks: Check[] = [];
  systems.forEach((s, i) => {
    if (i === hold) {
      const noGoLine = lines.length;
      lines.push({ who: s.who, text: s.problem, fx: "nogo" });
      lines.push({ who: "piggy", text: "Holding the countdown. Take your time, fix it right." });
      const fixLine = lines.length;
      lines.push({ who: s.who, text: "Ugh, not now! Wrench out, let me fix this.", fx: "wrench" });
      const goLine = lines.length;
      lines.push({ who: s.who, text: s.fix, fx: "fixed" });
      lines.push({ who: "piggy", text: "Great work! Back to the checks." });
      checks.push({ who: s.who, label: s.label, noGoLine, fixLine, goLine });
    } else {
      checks.push({ who: s.who, label: s.label, goLine: lines.length });
      lines.push({ who: s.who, text: s.go });
    }
  });
  lines.push({ who: "piggy", text: "All checks complete. Everyone is safe and ready. Starting the countdown!" });
  return { lines, checks };
}

/** Something goes wrong in space. The crew either fixes it and carries on, or turns for home. Both end safe. */
export type Trouble = { cause: number; outcome: "continue" | "abort" };
const troubles = [
  { alarm: "Alarm! A tiny meteoroid just hit the hull!", scare: "It is so loud! Is the spacecraft going to be okay?", fix: "Patched the hull, pressure is holding steady." },
  { alarm: "Alarm! A solar flare is surging past us!", scare: "Everything is flickering! We are scared!", fix: "Shielded the cabin, the flare has passed." },
  { alarm: "Alarm! The cabin pressure is dropping!", scare: "We cannot hear the air! Please, somebody help!", fix: "Sealed the leak, pressure is back to normal." },
];

/** How often something goes wrong in space, and how often that means turning back. */
export const TROUBLE_CHANCE = 0.35;
export const ABORT_CHANCE = 0.4;

/** Decides at random whether there is trouble in space, what it is, and how it ends. Pure given the dice. */
export function chooseTrouble(random: () => number = Math.random): Trouble | undefined {
  if (random() >= TROUBLE_CHANCE) return undefined;
  const cause = Math.min(troubles.length - 1, Math.floor(random() * troubles.length));
  return { cause, outcome: random() < ABORT_CHANCE ? "abort" : "continue" };
}

/** Alarm, terror, calm, then Piggy with a tear and the photo of the Polish elephants, then relief. */
function troubleScenes(t: Trouble): Scene[] {
  const x = troubles[t.cause];
  const abort = t.outcome === "abort";
  return [
    {
      id: "emergency",
      kind: "emergency",
      title: "Trouble in space",
      mood: "worry",
      ok: true,
      ms: 4000,
      present: NC_CREW,
      photo: "sad",
      lines: [
        { who: "hamley", text: x.alarm, fx: "alarm" },
        { who: "elephants", text: x.scare },
        { who: "little-duck", text: "I want to go home! Quack!" },
        { who: "piggy", text: "Everybody, breathe. We trained for this. Stay calm, and do exactly what we practiced." },
        { who: "gray-elephant", text: "Ground station is with you. We have the numbers, one step at a time." },
        { who: "piggy", text: "(sniffle) Look at them, in my photo frame... I promise I will bring them home safe.", fx: "sad" },
      ],
    },
    {
      id: "resolution",
      kind: "emergency",
      title: abort ? "Turning for home" : "Back on track",
      mood: "cheer",
      ok: true,
      ms: 3600,
      present: NC_CREW,
      photo: "happy",
      lines: abort
        ? [
            { who: "blue-bear", text: "The damage is stable, but the safest call is to turn back.", fx: "fixed" },
            { who: "piggy", text: "Agreed. Nobody gets hurt on my watch. Turning for home!" },
            { who: "elephants", text: "Home is the best place to be. Hi, family, we are coming back!" },
          ]
        : [
            { who: "blue-bear", text: x.fix, fx: "fixed" },
            { who: "piggy", text: "(wipes his eyes) We are back on track, my friends. Onward to the Moon!" },
            { who: "elephants", text: "That was scary, but we did it together. Thank you, everyone!" },
          ],
    },
  ];
}

export function missionScript(design: Design, result: MissionResult, hold?: number, trouble?: Trouble): Scene[] {
  const final = finalChecks(hold);
  // A design that never left the pad: Mission Control re-checks the numbers, and the crew learns why.
  if (!result.launched) {
    const code = evaluate(design).issues[0]?.code ?? "no-vehicle";
    return withReadingTime([
      {
        id: "control",
        kind: "control",
        title: "Mission Control",
        mood: "worry",
        ok: false,
        ms: 4200,
        lines: [
          { who: "piggy", text: "Hold the countdown! Something is not right." },
          { who: "hamley", text: result.biggestLoss ?? "The launch is not ready." },
          { who: "elephants", text: "Better we find out here than on the Moon." },
        ],
      },
      {
        id: "wrap",
        kind: "wrap",
        title: "What we learned",
        mood: "learn",
        ok: false,
        ms: 0,
        lines: [{ who: "piggy", text: "Every scrub teaches us something. Change one thing and try again." }],
        lesson: lessons[code],
      },
    ]);
  }

  const scenes: Scene[] = [
    {
      id: "control",
      kind: "control",
      title: "Mission Control",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.control,
      present: NC_CREW,
      countdown: true,
      checks: final.checks,
      lines: final.lines,
    },
    {
      id: "liftoff",
      kind: "liftoff",
      title: "Liftoff",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.liftoff,
      lines: [
        { who: "piggy", text: "And we have liftoff!" },
        { who: "little-duck", text: "Look at it go!" },
        { who: "elephants", text: "Whoa, the Earth is getting small!" },
      ],
    },
    {
      id: "transit",
      kind: "transit",
      title: "The trip to the Moon",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.transit,
      lines: [
        { who: "hamley", text: "Signal is strong. Three days to the Moon." },
        { who: "blue-bear", text: "Solar array is folded away and happy." },
        { who: "gray-elephant", text: "Tracking it from the ground, right on course." },
      ],
    },
    {
      id: "landing",
      kind: "landing",
      title: "Landing at the south pole",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.landing,
      lines: [
        { who: "piggy", text: "Touchdown at the south pole!" },
        { who: "elephants", text: "Shh, we are being very discreet... but hi, family! We made it!" },
        { who: "gray-elephant", text: "Look at that crater rim, it is beautiful." },
      ],
    },
  ];
  const abort = trouble?.outcome === "abort";
  // The trouble comes between the trip and the landing. Turning for home skips the Moon altogether.
  if (trouble) scenes.splice(scenes.findIndex((s) => s.kind === "landing"), abort ? 1 : 0, ...troubleScenes(trouble));

  const brownout = result.lossCause === "power" && !result.phases.at(-1)?.ok;
  const surfaceLines: Line[] = brownout
    ? [
        { who: "blue-bear", text: "Power is dropping, we need more sun!" },
        { who: "elephants", text: "The rover is dimming... it is shutting down." },
        { who: "piggy", text: "Stay calm. We will learn from this." },
      ]
    : result.lossCause === "data"
      ? [
          { who: "little-duck", text: "Look how much science I collected!" },
          { who: "hamley", text: "The antenna cannot carry it all, we are losing data!" },
          { who: "piggy", text: "Do not worry, we will learn from this." },
        ]
      : result.lossCause === "power"
        ? [
            { who: "little-duck", text: "Some instruments are switched off to save power." },
            { who: "blue-bear", text: "The array is working hard, but it needs more sun." },
          ]
        : [
            { who: "little-duck", text: "Samples collected, every one!" },
            { who: "hamley", text: "Receiving everything, the signal is strong." },
            { who: "blue-bear", text: `Power is steady all ${result.daysOperating} days.` },
          ];
  if (!abort) scenes.push({
    id: "surface",
    kind: "surface",
    title: "Working on the surface",
    mood: result.lossCause === null ? "cheer" : "worry",
    ok: result.phases.at(-1)?.ok ?? false,
    ms: PLAY_MS.surface,
    lines: surfaceLines,
    beam: result.dataRatio,
  });

  if (result.success && !abort) {
    scenes.push({
      id: "joyride",
      kind: "joyride",
      title: "A little me time",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.joyride,
      present: ["little-bear", "piggy", "gray-elephant", "hamley", "blue-bear", "little-duck"],
      lines: [
        { who: "elephants", text: "Wheee! Faster, faster, ha ha ha!" },
        { who: "little-bear", text: "Careful up there. Safety and silliness first!" },
        { who: "gray-elephant", text: "Save me a turn!" },
        { who: "piggy", text: "Okay, okay. Back to work, after one more lap." },
      ],
    });
  }

  // Whatever happened on the Moon, the crew comes home. A splashdown, then the recovery team finds them.
  scenes.push(
    {
      id: "splashdown",
      kind: "splashdown",
      title: "Splashdown",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.splashdown,
      countdown: true,
      countWord: "SPLASH",
      lines: [
        { who: "piggy", text: "Re-entry! Hold on to your helmets, everybody!" },
        { who: "hamley", text: "Three parachutes are out. Beautiful canopies." },
        { who: "blue-bear", text: "The heat shield did its job. Almost home!" },
        { who: "piggy", text: "Brace yourselves. Splashdown countdown starting!" },
      ],
    },
    {
      id: "recovery",
      kind: "recovery",
      title: "Safe recovery",
      mood: "cheer",
      ok: true,
      ms: PLAY_MS.recovery,
      present: NC_CREW,
      headcount: NC_CREW,
      lines: [
        { who: "gray-elephant", text: "The recovery team has us in sight." },
        { who: "elephants", text: "Hi, family! We are home, and we are safe!" },
        { who: "little-bear", text: "Look, everyone is on the dock, waving and cheering for us!" },
        { who: "piggy", text: "All paws, trunks, snouts, and tails accounted for. Everybody is safe and sound." },
        { who: "little-duck", text: "What a mission! Days of work, and every one of us made it home!" },
      ],
    },
  );

  if (abort) {
    scenes.push({
      id: "wrap",
      kind: "wrap",
      title: "Home safe",
      mood: "learn",
      ok: true,
      ms: 0,
      present: NC_CREW,
      lines: [
        { who: "piggy", text: "Everyone is home, safe and unharmed. That is the most important result of all." },
        { who: "elephants", text: "We are grateful for every one of you. Next time, the Moon!" },
      ],
      lesson: { title: "Turning back is a good call", text: "A real crew puts safety first. Nobody was hurt, and everything learned makes the next mission stronger. Launch again whenever you are ready." },
    });
    return withReadingTime(scenes);
  }

  scenes.push({
    id: "wrap",
    kind: "wrap",
    title: result.success ? "Mission success!" : "What we learned",
    mood: result.success ? "cheer" : "learn",
    ok: result.success,
    ms: 0,
    present: result.success ? [...NC_CREW, "little-bear"] : undefined,
    lines: [
      {
        who: "piggy",
        text: result.success
          ? `${result.science} percent of the science came home. Great teamwork, everyone!`
          : `${result.science} percent of the science came home. Every mission teaches us something.`,
      },
      {
        who: "elephants",
        text: result.success ? "Thank you, family and friends! We love this life, and we are so grateful." : "We are grateful for every lesson, and for everyone cheering us on.",
      },
    ],
    lesson: result.success ? lessons.success : lessons[result.lossCause === "data" ? "data" : "power"],
  });
  return withReadingTime(scenes);
}
