import Link from "next/link";
import GameSettings from "./GameSettings";

export default function GamePageNav() {
  return (
    <nav aria-label="Main navigation" className="flex items-center justify-between gap-3">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ice underline-offset-4 hover:underline">
        &larr; Mission Control
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/missions" className="inline-flex min-h-11 items-center rounded-lg border border-amber/60 px-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-amber hover:bg-amber/10">
          Missions
        </Link>
        <GameSettings />
      </div>
    </nav>
  );
}
