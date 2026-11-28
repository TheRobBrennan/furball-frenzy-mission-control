"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Furball from "@/components/characters/Furballs";
import { chooseHold, chooseTrouble, clampSpeed, COUNT_STEP_MS, countdownStart, formatStamp, lineStarts, MAX_SPEED, MIN_SPEED, missionScript, names, readSound, readSpeed, scaled, SOUND_KEY, SPEED_KEY, speedLabel, type Design, type MissionResult, type Scene, type Trouble, type Who } from "@/lib/mission";
import { reducedMotion } from "@/lib/motion";
import { saveSoundEnabled } from "@/lib/soundPreference";
import { playComms, playCountdown, playLiftoff, playAlarm, playFixed, playNoGo, playPhase, playSad, playSplash, playWrench, setSoundEnabled, startAmbience, stopAmbience } from "./missionSound";
import SceneArt from "./SceneArt";

/** A saved override for the random surprises, used by the tests: "none", a number, or "abort:1" and "continue:0". */
const stored = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const holdOverride = (): number | null | undefined => {
  const v = stored("ff-story-hold");
  return v === null ? undefined : v === "none" ? null : Number(v);
};
const troubleOverride = (): Trouble | null | undefined => {
  const v = stored("ff-story-trouble");
  if (v === null) return undefined;
  if (v === "none") return null;
  const [outcome, cause] = v.split(":");
  return { outcome: outcome === "abort" ? "abort" : "continue", cause: Number(cause) || 0 };
};

const cast = (scene: Scene): Who[] => scene.present ?? [...new Set(scene.lines.map((l) => l.who))];

type Clock = () => Date;
type CheckState = "pending" | "nogo" | "fixing" | "go";
type StageProps = { scene: Scene; animate: boolean; speed: number; paused: boolean; clock: Clock; last: boolean; onNext: () => void; onDone: () => void };

/** One scene. It is keyed by the scene, so its clock starts fresh each time. */
function Stage({ scene, animate, speed, paused, clock, last, onNext, onDone }: StageProps) {
  // One clock drives the scene, so pausing stops it and playing carries on from the same moment.
  const [elapsed, setElapsed] = useState(0);
  const total = scaled(scene.ms > 0 ? scene.ms : 3600, speed);
  const starts = useMemo(() => lineStarts(scene.lines).map((t) => scaled(t, speed)), [scene.lines, speed]);
  const lineIdx = animate ? Math.max(0, starts.filter((t) => t <= elapsed).length - 1) : scene.lines.length - 1;
  const heldFor = animate ? starts.filter((t) => t <= elapsed).length : scene.lines.length;

  // The countdown waits until the last check is in and Piggy has called the all clear.
  const steps = useMemo(() => {
    const from = scene.countdown ? scaled(countdownStart(scene), speed) : 0;
    return ["3", "2", "1", scene.countWord ?? "LIFTOFF"].map((t, i) => ({ t, at: from + i * scaled(COUNT_STEP_MS, speed) }));
  }, [scene, speed]);
  const counted = animate && scene.countdown ? steps.filter((s) => s.at <= elapsed).at(-1) : undefined;
  // Where each system stands: waiting, no-go, being fixed, or go. A no-go holds everything until it is go again.
  const stateOf = (c: NonNullable<Scene["checks"]>[number]): CheckState => {
    if (!animate || heldFor > c.goLine) return "go";
    if (c.noGoLine !== undefined && heldFor > c.noGoLine) return heldFor > (c.fixLine ?? c.goLine) ? "fixing" : "nogo";
    return "pending";
  };
  const states = scene.checks?.map((c) => ({ c, state: stateOf(c) })) ?? [];
  const onHold = states.some((s) => s.state === "nogo" || s.state === "fixing");
  const countText = counted?.t ?? (onHold || (scene.kind === "control" && scene.mood === "worry") ? "HOLD" : scene.countdown ? (scene.kind === "control" ? "CHECKS" : "RE-ENTRY") : undefined);

  // Each message is stamped with the real time it appeared, so the transcript reads like a mission log.
  const [stamps, setStamps] = useState<Date[]>(() => (animate ? [] : scene.lines.map(() => clock())));
  const clockTime = useRef(0);
  useEffect(() => {
    if (!animate || paused) return;
    const tick = window.setInterval(() => {
      clockTime.current += 100;
      const now = clockTime.current;
      const count = starts.filter((t) => t <= now).length;
      const stamp = clock();
      setElapsed(now);
      setStamps((prev) => (prev.length < count ? [...prev, ...Array.from({ length: count - prev.length }, () => stamp)] : prev));
    }, 100);
    return () => window.clearInterval(tick);
  }, [animate, paused, starts, clock]);

  const advanced = useRef(false);
  useEffect(() => {
    if (animate && scene.ms > 0 && elapsed >= total && !advanced.current) {
      advanced.current = true;
      onNext();
    }
  }, [animate, scene.ms, elapsed, total, onNext]);

  // A line over comms blips as it appears, and the countdown calls each number once.
  useEffect(() => {
    if (animate && heldFor > 0) playComms();
  }, [animate, heldFor]);
  useEffect(() => {
    if (counted) playCountdown(counted.t);
  }, [counted]);

  // The buzzer, the wrench, and the cheer play as the line that carries them appears.
  const fx = animate && heldFor > 0 ? scene.lines[heldFor - 1]?.fx : undefined;
  useEffect(() => {
    if (fx === "nogo") playNoGo();
    else if (fx === "wrench") playWrench();
    else if (fx === "fixed") playFixed();
    else if (fx === "alarm") playAlarm();
    else if (fx === "sad") playSad();
  }, [fx, heldFor]);

  // The splash lands about two thirds of the way through the splashdown scene.
  const splashed = animate && counted?.t === "SPLASH";
  useEffect(() => {
    if (splashed) {
      playSplash();
      playFixed();
    }
  }, [splashed]);
  // The capsule comes down as the countdown runs, and lands on the last word.
  const fall = animate && scene.kind === "splashdown" ? Math.min(1, elapsed / Math.max(1, steps[3].at)) : undefined;

  // The sounds under a scene start when it does, and the ambience stops when it ends.
  useEffect(() => {
    startAmbience(scene.kind === "control" ? "room" : "space");
    if (scene.kind === "liftoff") playLiftoff();
    else if (scene.kind === "surface" || scene.kind === "wrap") playPhase(scene.ok);
    else if (scene.kind === "landing") playPhase(true);
    return stopAmbience;
  }, [scene]);

  // The captions pile up as a transcript, so nothing disappears before it can be read.
  const shown = scene.lines.slice(0, animate ? heldFor : scene.lines.length);
  const speaking = scene.lines[lineIdx]?.who;
  return (
    <div className="space-y-4">
      <SceneArt kind={scene.kind} mood={scene.mood} beam={scene.beam} countText={countText} fall={fall} animate={animate} speed={speed} paused={paused} />
      {/* The transcript sits right under the picture, so the newest message is always on screen. */}
      <div aria-live="polite" aria-relevant="additions" className="max-h-[40vh] min-h-[5.5rem] space-y-2 overflow-y-auto" data-testid="story-lines">
        {shown
          .map((l, i) => ({ l, i }))
          .reverse()
          .map(({ l, i }) => {
            const stamp = stamps[i] ? formatStamp(stamps[i]) : null;
            return (
              <p key={`${l.who}-${l.text}`} className={`story-caption rounded-2xl border px-4 py-3 text-base sm:text-lg ${i === shown.length - 1 ? "border-white/25 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/60"}`}>
                {stamp && (
                  <time dateTime={stamp.iso} data-testid="stamp" className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-ice/80">
                    {stamp.utc} &middot; {stamp.local}
                  </time>
                )}
                <span aria-hidden="true" className="mr-1 inline-block h-7 w-7 translate-y-1.5 align-baseline" data-testid="line-icon">
                  <Furball who={l.who} mood="cheer" label={names[l.who]} className="h-7 w-7" />
                </span>
                <span className="font-bold text-amber">{names[l.who]}:</span> {l.text}
              </p>
            );
          })}
      </div>
      {scene.photo && (
        <section aria-label="Piggy's photo" data-testid="piggy-ipad" data-mood={scene.photo} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="relative shrink-0">
            <Furball who="piggy" mood={scene.photo === "sad" ? "worry" : "cheer"} label="Piggy with his iPad" />
            {scene.photo === "sad" && animate && <span aria-hidden="true" className="story-tear absolute left-[58%] top-[44%] block h-3 w-2 rounded-full bg-sky-300" />}
          </div>
          <div className="rounded-xl border-4 border-white/70 bg-space p-2 shadow-lg" aria-label="The photo on Piggy's iPad">
            <Furball who="elephants" mood={scene.photo === "sad" ? "learn" : "cheer"} label="The Polish elephants, in the photo" waving={scene.photo === "happy" && animate} />
          </div>
          <p className="text-base text-white/85">{scene.photo === "sad" ? "Piggy looks at the photo of his Polish elephants, and a tear rolls down." : "Piggy smiles at the photo. Everyone is safe, and so is the plan."}</p>
        </section>
      )}
      {scene.checks && (
        <section aria-label="Pre-launch checks" data-testid="checks" className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Pre-launch checks</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-base sm:grid-cols-3">
            {states.map(({ c, state }) => {
              const mark = { go: "✔", pending: "…", nogo: "✖", fixing: "🔧" }[state];
              const tone = { go: "text-white", pending: "text-white/40", nogo: "text-rose-300 font-bold", fixing: "text-amber font-bold" }[state];
              const word = { go: ", go", pending: ", waiting", nogo: ", no-go", fixing: ", being fixed" }[state];
              return (
                <li key={c.label} data-testid={`check-${state}`} className={tone}>
                  <span aria-hidden="true" className="mr-1">{mark}</span>
                  {c.label}
                  <span className="sr-only">{word}</span>
                </li>
              );
            })}
          </ul>
          {onHold && <p className="mt-2 font-bold text-rose-300">Countdown on hold</p>}
          {(!animate || heldFor >= scene.lines.length) && <p className="mt-2 font-bold text-emerald-300">All systems go</p>}
        </section>
      )}
      <div className="flex flex-wrap items-end justify-center gap-4" aria-label="The crew">
        {cast(scene).map((who) => {
          const mine = states.find((s) => s.c.who === who);
          const grumbling = animate && mine?.state === "nogo";
          const fixing = animate && mine?.state === "fixing";
          // After the fix, whoever made it is pleased, for the next couple of lines.
          const happy = animate && mine?.c.noGoLine !== undefined && mine.state === "go" && heldFor <= mine.c.goLine + 2;
          const terrified = animate && scene.kind === "emergency" && scene.mood === "worry";
          const motion = grumbling || terrified ? "story-grumble" : fixing ? "story-fixing" : happy ? "story-happy" : animate && !paused && speaking === who ? "story-speaking" : "";
          return (
          <div key={who} data-testid={motion && motion !== "story-speaking" ? `crew-${motion.replace("story-", "")}` : undefined} className={`flex flex-col items-center gap-1 ${motion}`}>
            <Furball who={who} mood={grumbling || fixing ? "worry" : scene.mood} label={names[who]} waving={animate && ((who === "elephants" && scene.mood === "cheer") || happy)} />
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-white/60">{names[who]}</span>
          </div>
          );
        })}
      </div>
      {scene.headcount && heldFor >= 3 && (
        <section aria-label="Headcount" data-testid="headcount" className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">All paws, trunks, snouts, and tails accounted for</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-base text-white">
            {scene.headcount.map((who) => (
              <li key={who}>
                <span aria-hidden="true" className="mr-1 text-emerald-300">
                  ✔
                </span>
                {names[who]}, safe
              </li>
            ))}
          </ul>
        </section>
      )}
      {last && scene.lesson && (
        <section aria-label="Learning point" data-testid="lesson" className="rounded-2xl border border-amber/50 bg-amber/10 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">{scene.ok ? "What worked" : "Learning point"}</p>
          <h3 className="mt-1 text-lg font-black text-white">{scene.lesson.title}</h3>
          <p className="mt-1 text-base text-white/85">{scene.lesson.text}</p>
        </section>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {last ? (
          <button type="button" autoFocus onClick={onDone} className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-8 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            See the debrief
          </button>
        ) : (
          !animate && (
            <button type="button" autoFocus onClick={onNext} className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-8 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Next
            </button>
          )
        )}
      </div>
    </div>
  );
}

/**
 * The mission, told by the furballs: Mission Control, liftoff, the trip, the landing, the work on the
 * surface, a little joyride in the rover, and the wrap. A mission that goes wrong ends with the crew
 * discovering the learning point. It plays by itself, or one tap at a time with reduced motion.
 */
export type PlaybackEnding = "completed" | "skipped";
/** How this run of the story turns out, which can differ from the simulation when the crew turns for home. */
export type StoryEnding = "success" | "learned" | "turned_home" | "grounded";
export type SceneView = { scene: string; title: string; position: number; total: number };
export type PlaybackSummary = { story: StoryEnding; lastScene: string };

export default function MissionStory({ design, result, onDone, clock = () => new Date(), hold, trouble, onScene }: { design: Design; result: MissionResult; onDone: (ending: PlaybackEnding, summary: PlaybackSummary) => void; onScene?: (view: SceneView) => void; clock?: () => Date; hold?: number | null; trouble?: Trouble | null }) {
  // Now and then a system reports no-go at the final checks. It is decided once, at random, unless a test says otherwise.
  const [chosenHold] = useState(() => {
    const set = hold === undefined ? holdOverride() : hold;
    return set === undefined ? chooseHold() : (set ?? undefined);
  });
  // And now and then something goes wrong in space, and the crew either fixes it or turns for home. Both end safe.
  const [chosenTrouble] = useState(() => {
    const set = trouble === undefined ? troubleOverride() : trouble;
    return set === undefined ? chooseTrouble() : (set ?? undefined);
  });
  const scenes = useMemo(() => missionScript(design, result, chosenHold, chosenTrouble), [design, result, chosenHold, chosenTrouble]);
  const [animate] = useState(() => !reducedMotion());
  const [index, setIndex] = useState(0);
  // The pace starts lazy, and the visitor's choice is remembered. The slider applies when it is let go,
  // and the scene then plays again from the start at the new pace.
  const [speed, setSpeed] = useState(() => {
    try {
      return readSpeed(window.localStorage.getItem(SPEED_KEY));
    } catch {
      return readSpeed(null);
    }
  });
  const [draft, setDraft] = useState(speed);
  const [paused, setPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return readSound(window.localStorage.getItem(SOUND_KEY));
    } catch {
      return true;
    }
  });
  useEffect(() => {
    setSoundEnabled(soundOn);
    return () => stopAmbience();
  }, [soundOn]);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    saveSoundEnabled(next);
  };
  const commitSpeed = () => {
    const next = clampSpeed(draft);
    setSpeed(next);
    try {
      window.localStorage.setItem(SPEED_KEY, String(next));
    } catch {
      // The pace just is not remembered, that is fine.
    }
  };
  const story: StoryEnding = !result.launched ? "grounded" : chosenTrouble?.outcome === "abort" ? "turned_home" : result.success ? "success" : "learned";
  const position = Math.min(index, scenes.length - 1);
  const { id: sceneId, title: sceneTitle } = scenes[position];
  const seen = useRef(onScene);
  useEffect(() => {
    seen.current = onScene;
  }, [onScene]);
  useEffect(() => {
    seen.current?.({ scene: sceneId, title: sceneTitle, position: position + 1, total: scenes.length });
  }, [sceneId, sceneTitle, position, scenes.length]);
  const summary = useRef<PlaybackSummary>({ story, lastScene: sceneId });
  useEffect(() => {
    summary.current = { story, lastScene: sceneId };
  }, [story, sceneId]);
  const finished = useRef(false);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  const finish = useCallback((ending: PlaybackEnding) => {
    if (finished.current) return;
    finished.current = true;
    done.current(ending, summary.current);
  }, []);
  const next = useCallback(() => setIndex((i) => i + 1), []);
  const last = scenes.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish("skipped");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const scene = scenes[Math.min(index, last)];
  return (
    <div role="dialog" aria-modal="true" aria-label="The mission story" data-testid="mission-story" className="fixed inset-0 z-[70] overflow-y-auto bg-space/95 backdrop-blur">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-4 px-4 py-6 sm:py-10" data-paused={paused} style={{ "--story-speed": speed } as React.CSSProperties}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-amber">
              Scene {Math.min(index, last) + 1} of {scenes.length}
            </p>
            <h2 className="text-2xl font-black text-white sm:text-3xl" data-testid="scene-title">
              {scene.title}
            </h2>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            {animate && (
              <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} data-testid="pause" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-white/30 px-4 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber">
                {paused ? "Play" : "Pause"}
              </button>
            )}
            <button type="button" onClick={toggleSound} aria-pressed={soundOn} data-testid="sound" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-white/30 px-4 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber">
              Sound {soundOn ? "on" : "off"}
            </button>
            {Math.min(index, last) < last && (
              <button type="button" onClick={() => finish("skipped")} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-white/30 px-5 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber">
                Skip to the debrief
              </button>
            )}
          </div>
        </div>
        {animate && (
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/70">
            <span className="shrink-0">Speed</span>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={0.05}
              value={draft}
              aria-label="Animation speed"
              aria-valuetext={`${speedLabel(draft)}, ${draft} times`}
              data-testid="speed"
              onChange={(e) => setDraft(Number(e.target.value))}
              onPointerUp={commitSpeed}
              onKeyUp={commitSpeed}
              onBlur={commitSpeed}
              className="h-8 w-full min-w-0 accent-amber"
            />
            <span className="w-24 shrink-0 text-right text-amber" data-testid="speed-label">
              {speedLabel(draft)} {draft}x
            </span>
          </label>
        )}
        <div className="flex gap-1.5" aria-hidden="true">
          {scenes.map((s, i) => (
            <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-amber" : "bg-white/15"}`} />
          ))}
        </div>
        <Stage key={`${scene.id}-${speed}`} scene={scene} animate={animate} speed={speed} paused={paused} clock={clock} last={Math.min(index, last) === last} onNext={next} onDone={() => finish("completed")} />
      </div>
    </div>
  );
}
