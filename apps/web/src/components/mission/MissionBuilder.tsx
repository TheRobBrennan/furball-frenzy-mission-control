"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  choose,
  commsParts,
  emptyDesign,
  evaluate,
  instruments,
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
import LaunchSequence from "./LaunchSequence";
import { primeMissionSound } from "./missionSound";
import PartCard from "./PartCard";

const partStats = (p: Part) => [
  `${p.massKg} kg`,
  p.generationW ? `+${p.generationW} W` : `${p.powerW} W`,
  `$${p.costM}M`,
  ...(p.dataMbPerDay ? [`${p.dataMbPerDay} Mb/day`] : []),
  ...(p.downlinkMbPerDay ? [`sends ${p.downlinkMbPerDay} Mb/day`] : []),
  ...(p.science ? [`${p.science} science`] : []),
];

const reducedMotion = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (reducedMotion()) {
      setResult(r);
      return;
    }
    pending.current = r;
    setRunning(r);
  };

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

      {running && <LaunchSequence result={running} onDone={finishLaunch} />}

      {result && (
        <div ref={debrief} className="scroll-mt-16 lg:col-span-2">
          <Debrief result={result} onChange={() => setResult(null)} onReset={() => update(emptyDesign)} />
        </div>
      )}
    </div>
  );
}
