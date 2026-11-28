import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import GamePageNav from "@/components/GamePageNav";
import MissionBuilder from "@/components/mission/MissionBuilder";
import StayUpdated from "@/components/StayUpdated";

export const metadata: Metadata = {
  title: "Design the mission | Furball Frenzy: Mission Control",
  description: "Pick a launcher, instruments, a solar array, and an antenna for the Polish elephants' rover to the lunar south pole, then launch and read the debrief.",
};

export default function MissionPage() {
  return (
    <>
    <GamePageNav />
    <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
      <Breadcrumbs current="Design the mission" />
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Mission 1</p>
        <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">Design the mission</h1>
        <p className="mt-3 text-lg text-white/80">
          The Polish elephants want their rover on the Moon&apos;s south pole. Pick what goes on it and what throws it there. Every choice costs mass, power,
          money, or data, and there is no single perfect design.
        </p>
      </header>
      <div className="mt-6">
        <MissionBuilder />
      </div>
      <StayUpdated />
    </main>
    </>
  );
}
