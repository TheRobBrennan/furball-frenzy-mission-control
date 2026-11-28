import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GamePageNav from "@/components/GamePageNav";
import NewSticker from "@/components/NewSticker";
import SiteFooter from "@/components/SiteFooter";
import { missions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Missions | Furball Frenzy: Mission Control",
  description: "Every Furball Frenzy mission in one place.",
};

export default function MissionsPage() {
  return (
    <>
    <GamePageNav />
    <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
      <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">Missions</h1>
      <ol className="mt-6 grid gap-6 md:grid-cols-2">
        {missions.map((m) => (
          <li key={m.id} className="relative">
            <Link href={m.href} className="group flex h-full flex-col rounded-3xl border border-white/15 bg-white/5 hover:border-amber hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber">
            {m.isNew && <NewSticker className="!absolute -right-1 -top-10 z-10" />}
            <div className="relative aspect-video overflow-hidden rounded-t-3xl">
              <Image src={m.image.src} alt={m.image.alt} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Mission {m.number}</p>
              <h2 className="mt-2 text-2xl font-black text-white">{m.title}</h2>
              <p className="mt-2 flex-1 text-pretty text-white/80">{m.summary}</p>
              <span className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space">
                {m.action}
              </span>
            </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
      <SiteFooter />
    </>
  );
}
