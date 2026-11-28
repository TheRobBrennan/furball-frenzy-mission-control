import type { Metadata } from "next";
import Link from "next/link";
import GamePageNav from "@/components/GamePageNav";
import { missions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Missions | Furball Frenzy: Mission Control",
  description: "Every Furball Frenzy mission in one place.",
};

export default function MissionsPage() {
  return (
    <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <GamePageNav />
      <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">Missions</h1>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {missions.map((m) => (
          <li key={m.id} className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
              Mission {m.number}
              {m.isNew && " · New"}
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{m.title}</h2>
            <p className="mt-2 flex-1 text-pretty text-white/80">{m.summary}</p>
            <Link href={m.href} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              {m.action}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
