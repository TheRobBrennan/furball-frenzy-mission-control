import type { Metadata } from "next";
import GamePageNav from "@/components/GamePageNav";
import ParadeShow from "@/components/parade/ParadeShow";

export const metadata: Metadata = {
  title: "Parade Day | Furball Frenzy: Mission Control",
  description: "The furballs hold their own Thanksgiving parade, with marching bands, giant balloons, and the American Space Program bringing up the rear.",
};

export default function ParadePage() {
  return (
    <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <GamePageNav />
      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">Parade Day</h1>
        <p className="mt-3 text-lg text-white/80">The furballs are holding their own Thanksgiving parade. Turn your sound up and find a good spot on the curb.</p>
      </header>
      <div className="mt-8">
        <ParadeShow />
      </div>
    </main>
  );
}
