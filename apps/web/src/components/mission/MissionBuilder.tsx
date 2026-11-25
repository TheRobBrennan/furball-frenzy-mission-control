"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reducedMotion } from "@/lib/motion";
import {
  choose,
  commsParts,
  emptyDesign,
  evaluate,
  instruments,
  JUDGES_PICK_MS,
  judgesPicks,
  powerParts,
  scenario,
  simulate,
  toggleInstrument,
  vehicles,
  type Design,
  type MissionResult,
  type Part,
} from "@/lib/mission";
import Debrief from "./Debrief";
import GaugeBar from "./GaugeBar";
import { primeMissionSound } from "./missionSound";
import MissionStory from "./MissionStory";
import PartCard from "./PartCard";
import TrailerButton from "@/components/TrailerButton";

const partStats = (p: Part) => [
  `${p.massKg} kg`,
  p.generationW ? `+${p.generationW} W` : `${p.powerW} W`,
  `$${p.costM}M`,
  ...(p.dataMbPerDay ? [`${p.dataMbPerDay} Mb/day`] : []),
  ...(p.downlinkMbPerDay ? [`sends ${p.downlinkMbPerDay} Mb/day`] : []),
  ...(p.science ? [`${p.science} science`] : []),
];

function Step({ n, title, hint, done, children }: { n: number; title: string; hint: string; done: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="space-y-3">
      <div>
        <h2 id={`step-${n}`} className="text-xl font-black text-white">
          <span className={`mr-2 font-mono ${done ? "text-emerald-300" : "text-amber"}`} data-testid={`step-${n}-${done ? "done" : "open"}`}>
            {done ? "✔" : n}
          </span>
          {title}
        </h2>
        <p className="text-sm text-white/65">{hint}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/** The whole slice: pick the launcher and parts, watch the six gauges, launch, read the debrief. */
export default function MissionBuilder() {
  const [design, setDesign] = useState<Design>(emptyDesign);
  const [result, setResult] = useState<MissionResult | null>(null);
  // The launch plays as a sequence first, and the debrief appears when it ends.
  const [running, setRunning] = useState<MissionResult | null>(null);
  const pending = useRef<MissionResult | null>(null);
  const debrief = useRef<HTMLDivElement>(null);
  const evaluation = useMemo(() => evaluate(design), [design]);

  const launch = () => {
    primeMissionSound();
    const r = simulate(design);
    pending.current = r;
    setRunning(r);
  };
  // The automatic launch needs the design the picks just built, so it reads the latest through a ref.
  const launchRef = useRef(launch);
  useEffect(() => {
    launchRef.current = launch;
  });

  // "Judges, start here": the elephants pick every part, one at a time, then launch. Any click stops it.
  const [auto, setAuto] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const stopAuto = useCallback(() => {
    window.clearTimeout(timer.current);
    setAuto(null);
  }, []);
  const startAuto = useCallback(() => {
    primeMissionSound();
    setResult(null);
    setDesign(emptyDesign);
    setAuto(0);
  }, []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("judges")) {
      const t = window.setTimeout(startAuto, 0);
      return () => window.clearTimeout(t);
    }
  }, [startAuto]);
  useEffect(() => {
    if (auto === null) return;
    // Each pick lands as its step comes up, and after the last one the mission launches by itself.
    timer.current = window.setTimeout(() => {
      if (auto < judgesPicks.length) {
        setDesign((d) => judgesPicks[auto].apply(d));
        setAuto(auto + 1);
      } else {
        setAuto(null);
        launchRef.current();
      }
    }, auto === 0 ? 600 : JUDGES_PICK_MS);
    return () => window.clearTimeout(timer.current);
  }, [auto]);

  const finishLaunch = useCallback(() => {
    setResult(pending.current);
    pending.current = null;
    setRunning(null);
  }, []);

  // The debrief is below the fold, so bring it into view when it appears.
  useEffect(() => {
    if (result) debrief.current?.scrollIntoView?.({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  }, [result]);

  // Any change to the design clears an old debrief, it would no longer describe what is on screen.
  const update = (next: Design) => {
    setDesign(next);
    setResult(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* On a phone the full panel is below the steps, so the six gauges stay in view up here. */}
      <div
        data-testid="gauge-strip"
        aria-hidden="true"
        className="sticky top-0 z-20 -mx-4 grid grid-cols-3 gap-x-3 gap-y-2 border-b border-white/10 bg-space/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden"
      >
        {evaluation.gauges.map((g) => (
          <GaugeBar key={g.id} gauge={g} compact />
        ))}
      </div>
      <div className="space-y-8">
        <section aria-label="Judges, start here" className="rounded-3xl border border-amber/40 bg-amber/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              data-testid="judges-start"
              onClick={auto === null ? startAuto : stopAuto}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:shrink-0"
            >
              {auto === null ? "Judges, start here" : "Stop and design it myself"}
            </button>
            <p className="min-h-[3.5rem] min-w-0 text-base text-white/85 sm:flex-1" data-testid="judges-line" aria-live="polite">
              {auto === null ? "In 30 seconds, the Polish elephants design a mission and launch it for you." : auto === 0 ? "The Polish elephants roll up their sleeves..." : auto <= judgesPicks.length ? judgesPicks[auto - 1].line : ""}
            </p>
          </div>
          <div className="mt-3 text-base text-white/85">
            New here? You can <TrailerButton className="text-amber" />.
          </div>
        </section>
        <Step n={1} title="Pick a launcher" hint="It has to throw the whole rover to the Moon." done={design.vehicleId !== null}>
          {vehicles.map((v) => (
            <PartCard key={v.id} name={v.name} blurb={v.blurb} stats={[`throws ${v.capacityKg} kg`, `$${v.costM}M`]} selected={design.vehicleId === v.id} onSelect={() => update(choose(design, "vehicleId", v.id))} />
          ))}
        </Step>
        <Step n={2} title="Pick instruments" hint="Pick any. Each one adds science, and also mass, power, cost, and data." done={design.instrumentIds.length > 0}>
          {instruments.map((p) => (
            <PartCard key={p.id} name={p.name} blurb={p.blurb} stats={partStats(p)} selected={design.instrumentIds.includes(p.id)} onSelect={() => update(toggleInstrument(design, p.id))} />
          ))}
        </Step>
        <Step n={3} title="Pick a solar array" hint="The rover works the 14 day lunar day, in the sun." done={design.powerId !== null}>
          {powerParts.map((p) => (
            <PartCard key={p.id} name={p.name} blurb={p.blurb} stats={partStats(p)} selected={design.powerId === p.id} onSelect={() => update(choose(design, "powerId", p.id))} />
          ))}
        </Step>
        <Step n={4} title="Pick an antenna" hint="Whatever the instruments make has to get home." done={design.commsId !== null}>
          {commsParts.map((p) => (
            <PartCard key={p.id} name={p.name} blurb={p.blurb} stats={partStats(p)} selected={design.commsId === p.id} onSelect={() => update(choose(design, "commsId", p.id))} />
          ))}
        </Step>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Mission status">
        <div className="space-y-4 rounded-3xl border border-white/15 bg-space-2/95 p-5 shadow-xl shadow-black/40 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">{scenario.name}</p>
          <div className="space-y-3">
            {evaluation.gauges.map((g) => (
              <GaugeBar key={g.id} gauge={g} />
            ))}
          </div>
          {evaluation.issues.length > 0 && (
            <ul id="launch-issues" data-testid="issues" className="space-y-1 text-sm text-white/80">
              {evaluation.issues.map((i) => (
                <li key={i.code}>&bull; {i.message}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            data-testid="launch"
            disabled={!evaluation.canLaunch}
            aria-describedby={evaluation.canLaunch ? undefined : "launch-issues"}
            onClick={launch}
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition enabled:hover:brightness-110 ${evaluation.canLaunch && !result ? "motion-safe:animate-pulse" : ""} disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50 disabled:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
          >
            {evaluation.canLaunch ? "Launch" : "Launch locked"}
          </button>
        </div>
      </aside>

      {running && <MissionStory design={design} result={running} onDone={finishLaunch} />}

      {result && (
        <div ref={debrief} className="scroll-mt-16 lg:col-span-2">
          <Debrief result={result} design={design} onChange={() => setResult(null)} onReset={() => update(emptyDesign)} />
        </div>
      )}
    </div>
  );
}
