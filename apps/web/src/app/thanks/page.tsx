import type { Metadata } from "next";
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
      <div className="flex justify-center gap-3" aria-hidden="true">
        <Furball who="elephants" label="The Polish elephants" waving className="h-24 w-24" />
        <Furball who="piggy" label="Piggy" className="h-24 w-24" />
      </div>
      <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">Thank you!</h1>
      <p className="mt-4 text-lg text-white/85">
        The Polish elephants, Piggy, and the whole furball crew are waving hello and want you to know how grateful we are. You are on the list, and we will share
        the adventures of the Furball Frenzy and the elephants and family with you now and then.
      </p>
      <p className="mt-3 text-base text-white/70">If Flodesk asks you to confirm your email, look for its message in your inbox, and check the spam folder too.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/mission?judges=1"
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
