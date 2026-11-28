import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import GamePageNav from "@/components/GamePageNav";
import SiteFooter from "@/components/SiteFooter";
import ParadeShow from "@/components/parade/ParadeShow";

export const metadata: Metadata = {
  title: "Thanksgiving 2026 Parade | Furball Frenzy: Mission Control",
  description: "Sploosh.AI presents the furballs' Thanksgiving 2026 parade, with marching bands, giant balloons, and the American Space Program bringing up the rear.",
};

export default function ParadePage() {
  return (
    <>
    <GamePageNav />
    <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
      <Breadcrumbs current="Thanksgiving 2026 Parade" />
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Mission 2 · Sploosh.AI presents</p>
        <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">Thanksgiving 2026 Parade</h1>
        <p className="mt-3 text-pretty text-lg text-white/80">For the first time in Furball Frenzy history, the furballs are holding their own Thanksgiving parade. Turn your sound up and find a good spot on the curb.</p>
      </header>
      <div className="mt-6">
        <ParadeShow />
      </div>
    </main>
      <SiteFooter />
    </>
  );
}
