import { compareToReal, leftOnTable, type Design, type MissionResult } from "@/lib/mission";

/** What happened, phase by phase, how much science got home, and what cost the most. */
export default function Debrief({ result, design, onChange, onReset }: { result: MissionResult; design?: Design; onChange: () => void; onReset: () => void }) {
  const real = design && result.launched ? compareToReal(design) : null;
  const left = design ? leftOnTable(design, result) : [];
  return (
    <section aria-labelledby="debrief-heading" data-testid="debrief" data-success={result.success} className="rounded-3xl border border-white/15 bg-white/5 p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Mission debrief</p>
      <h2 id="debrief-heading" className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {result.success ? "Mission success!" : result.launched ? "The mission fell short" : "Stuck on the pad"}
      </h2>
      <ol className="mt-4 space-y-2">
        {result.phases.map((p) => (
          <li key={p.id} className="flex gap-3 text-base text-white/85">
            <span aria-hidden="true" className={p.ok ? "text-emerald-300" : "text-rose-300"}>
              {p.ok ? "✔" : "✘"}
            </span>
            <span>
              <span className="font-semibold">{p.label}.</span> {p.note}
            </span>
          </li>
        ))}
      </ol>
      {result.launched && (
        <p className="mt-4 font-mono text-sm text-ice" data-testid="science">
          Science returned: {result.science}% &middot; {result.daysOperating} days on the surface
        </p>
      )}
      {result.biggestLoss && (
        <p className="mt-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100" data-testid="biggest-loss">
          <span className="font-semibold">What cost the most:</span> {result.biggestLoss}
        </p>
      )}
      {left.length > 0 && (
        <div data-testid="left-on-table" className="mt-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/85">
          <p className="font-semibold text-white">What was left on the table</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {left.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      )}
      {real && (
        <section aria-label="Compared to a real mission" data-testid="real-mission" className="mt-3 rounded-xl border border-ice/30 bg-ice/10 p-4 text-sm text-white/90">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ice">Your rover is most like a real one</p>
          <h3 className="mt-1 text-lg font-black text-white">
            {real.mission.name} <span className="font-normal text-white/70">on {real.mission.where}</span>
          </h3>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-white/60">Mass</dt>
            <dd>{real.roverMassKg} kg yours, {real.mission.massKg === null ? "not stated by NASA" : `${real.mission.massKg} kg theirs`}</dd>
            <dt className="text-white/60">Instruments</dt>
            <dd>{real.instruments} yours, {real.mission.instruments === null ? "not stated by NASA" : `${real.mission.instruments} theirs`}</dd>
            <dt className="text-white/60">Power</dt>
            <dd>{real.mission.power}</dd>
            <dt className="text-white/60">How long</dt>
            <dd>{real.mission.length}</dd>
          </dl>
          <p className="mt-2">{real.mission.lesson}</p>
          <p className="mt-2 text-white/70">
            Sources:{" "}
            {real.mission.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {s.label}
                </a>
              </span>
            ))}
            . The game&apos;s numbers are simplified teaching values, so this shows scale and spirit, not an exact match.
          </p>
        </section>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onChange} className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Change one thing
        </button>
        <button type="button" onClick={onReset} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Start over
        </button>
      </div>
    </section>
  );
}
