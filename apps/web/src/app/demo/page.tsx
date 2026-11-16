import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The 30 second demo | Furball Frenzy: Mission Control",
  description: "A 30 second look at Furball Frenzy: Mission Control, the mission design game for the 2026 NASA Space Apps Challenge.",
};

/** The 30 second demo video, at a public link with no login, for the Space Apps submission. */
export default function DemoPage() {
  return (
    <main id="top" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ice underline-offset-4 hover:underline">
        &larr; Mission Control
      </Link>
      <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">The 30 second demo</h1>
      <p className="mt-2 text-lg text-white/80">
        Two Polish elephants, one lifelong dream. Watch the furballs design a mission, run their final checks, and fly to the Moon and home again, then learn
        how the rover compares to real NASA missions.
      </p>
      <video
        data-testid="demo-video"
        className="mt-6 aspect-video w-full rounded-2xl border border-white/15 bg-black"
        controls
        playsInline
        preload="metadata"
        poster="/demo/furball-frenzy-30s-poster.jpg"
      >
        <source src="/demo/furball-frenzy-30s.mp4" type="video/mp4" />
        Your browser does not play this video. <a href="/demo/furball-frenzy-30s.mp4">Download it here</a>.
      </video>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/mission?judges=1"
          className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Watch a mission for real
        </Link>
        <Link
          href="/mission"
          className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Design it yourself
        </Link>
        <a
          href="/demo/furball-frenzy-deck.pdf"
          data-testid="deck-link"
          className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          The 7 slide deck, PDF
        </a>
      </div>
    </main>
  );
}
