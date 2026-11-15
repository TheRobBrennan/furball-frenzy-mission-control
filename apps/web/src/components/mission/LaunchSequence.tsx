"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { launchSequence, type MissionResult } from "@/lib/mission";
import { playCount, playLiftoff, playPhase } from "./missionSound";

function Rocket({ lifted }: { lifted: boolean }) {
  return (
    <svg viewBox="0 0 60 120" aria-hidden="true" className={`mx-auto h-40 w-20 ${lifted ? "rocket-lift" : "rocket-shake"}`}>
      <path d="M 30,6 C 44,24 46,52 44,82 H 16 C 14,52 16,24 30,6 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="30" cy="44" r="7" fill="#8ecae6" stroke="#060f33" strokeWidth="2" />
      <path d="M 16,66 L 4,92 L 18,84 Z M 44,66 L 56,92 L 42,84 Z" fill="#fb5607" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 22,84 H 38 L 30,112 Z" fill="#ffb703" stroke="#fb5607" strokeWidth="2" strokeLinejoin="round" className={lifted ? "rocket-flame" : "opacity-0"} />
    </svg>
  );
}

/**
 * The launch, played back as a full-screen sequence: 3, 2, 1, liftoff, then each phase arriving with a
 * tick or a cross. It calls onDone at the end, or right away when the visitor skips it.
 */
export default function LaunchSequence({ result, onDone }: { result: MissionResult; onDone: () => void }) {
  const beats = useMemo(() => launchSequence(result), [result]);
  const [reached, setReached] = useState(0);
  const finished = useRef(false);
  const skip = useRef<HTMLButtonElement>(null);

  const finish = useRef(onDone);
  useEffect(() => {
    finish.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const end = () => {
      if (finished.current) return;
      finished.current = true;
      finish.current();
    };
    const timers = beats.map((b, i) =>
      window.setTimeout(() => {
        setReached(i + 1);
        if (b.kind === "count") playCount();
        else if (b.kind === "liftoff") playLiftoff();
        else if (b.kind === "phase") playPhase(b.ok);
        else end();
      }, b.at),
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && end();
    window.addEventListener("keydown", onKey);
    skip.current?.focus();
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
  }, [beats]);

  const seen = beats.slice(0, reached);
  const count = [...seen].reverse().find((b) => b.kind === "count");
  const lifted = seen.some((b) => b.kind === "liftoff");
  const phases = seen.filter((b) => b.kind === "phase");

  return (
    <div role="dialog" aria-modal="true" aria-label="Launch sequence" data-testid="launch-sequence" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-space/95 px-6 backdrop-blur">
      <Rocket lifted={lifted} />
      <p aria-live="polite" className="min-h-[4.5rem] text-center text-6xl font-black text-amber sm:text-7xl" data-testid="launch-count">
        {lifted ? "Liftoff!" : count && count.kind === "count" ? count.text : ""}
      </p>
      <ul className="w-full max-w-md space-y-2" aria-label="Mission phases">
        {phases.map((p) =>
          p.kind === "phase" ? (
            <li key={p.label} className="flex gap-3 text-base text-white/90">
              <span aria-hidden="true" className={p.ok ? "text-emerald-300" : "text-rose-300"}>
                {p.ok ? "✔" : "✘"}
              </span>
              <span>
                <span className="font-semibold">{p.label}.</span> {p.note}
              </span>
            </li>
          ) : null,
        )}
      </ul>
      <button
        ref={skip}
        type="button"
        onClick={() => {
          if (finished.current) return;
          finished.current = true;
          finish.current();
        }}
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
      >
        Skip to the debrief
      </button>
    </div>
  );
}
