import Link from "next/link";
import GameSettings from "./GameSettings";

export default function GamePageNav() {
  return (
    <nav aria-label="Main navigation" className="flex items-center justify-between gap-3">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ice underline-offset-4 hover:underline">
        &larr; Mission Control
      </Link>
      <GameSettings />
    </nav>
  );
}
