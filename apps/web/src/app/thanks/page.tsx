import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Furball from "@/components/characters/Furballs";

export const metadata: Metadata = {
  title: "Thank you | Furball Frenzy: Mission Control",
  robots: { index: false },
};

/** Where Flodesk sends a new subscriber, a thank you from the Polish elephants and the whole crew. */
export default function ThanksPage() {
  return (
    <main id="top" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 text-center sm:px-6 sm:py-16">
      <div className="relative mx-auto w-full max-w-sm">
        {/* Confetti falls behind the photo, and stops for a visitor who asked for less motion. */}
        <div className="pointer-events-none absolute inset-x-0 -top-4 h-72 overflow-hidden" aria-hidden="true" data-testid="confetti">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              className="story-confetti absolute -top-3 block h-3 w-2 rounded-sm"
              style={{ left: `${(i * 37) % 100}%`, backgroundColor: ["#ffb703", "#fb5607", "#8ecae6", "#34d399", "#f472b6"][i % 5], animationDelay: `${(i % 9) * 0.35}s` }}
            />
          ))}
        </div>
        <figure className="polaroid relative mx-auto w-64 rotate-[-3deg] rounded-md bg-white p-3 pb-4 shadow-2xl shadow-black/60 sm:w-72" data-testid="thanks-photo">
          <Image
            src="/images/elephants-at-the-window.jpg"
            alt="The Polish elephants and Piggy, waving hello from a window seat"
            width={1200}
            height={1600}
            priority
            sizes="(min-width: 640px) 18rem, 16rem"
            className="aspect-[3/4] w-full rounded-sm object-cover"
          />
          <figcaption className="mt-2 font-mono text-xs text-black/70">Waving hello, just for you</figcaption>
        </figure>
      </div>
      <div className="mt-6 flex flex-nowrap items-end justify-center gap-2 sm:gap-3" aria-hidden="true" data-testid="thanks-crew">
        {(["elephants", "piggy", "hamley", "blue-bear", "little-bear", "little-duck"] as const).map((who) => (
          // Each portrait sits in the same sized cell on the same baseline, and they all hop together, so the row stays level.
          <div key={who} className={`story-happy flex shrink-0 items-end justify-center ${who === "elephants" ? "h-10 w-14 sm:h-14 sm:w-20" : "h-10 w-10 sm:h-14 sm:w-14"}`}>
            <Furball who={who} label={who} waving={who === "elephants"} className="h-full w-full" />
          </div>
        ))}
      </div>
      <h1 className="mt-8 text-3xl font-black leading-tight text-white sm:text-5xl">Thank you!</h1>
      <p className="mt-4 text-lg text-white/85">
        The Polish elephants, Piggy, and the whole furball crew are waving hello and want you to know how grateful we are. You are on the list, and we will share
        the adventures of the Furball Frenzy and the elephants and family with you now and then.
      </p>
      <p className="mt-3 text-base text-white/70">If Flodesk asks you to confirm your email, look for its message in your inbox, and check the spam folder too.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/missions/lunar-south-pole?judges=1"
          className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Watch a mission
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/30 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Back to Mission Control
        </Link>
      </div>
    </main>
  );
}
