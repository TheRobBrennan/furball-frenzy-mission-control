"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsKey, readConsent, startAnalytics, writeConsent } from "@/lib/analytics";

/** The analytics question, at the bottom of the page, only when analytics is set up and the visitor has not answered. No means nothing is recorded. */
export default function AnalyticsConsent() {
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!analyticsKey()) return;
    const consent = readConsent();
    if (consent === "yes") void startAnalytics();
    // Decided in a timer, so the page renders first and the notice does not flash in during load.
    const t = consent === null ? window.setTimeout(() => setAsking(true), 1500) : undefined;
    return () => window.clearTimeout(t);
  }, []);

  if (!asking) return null;
  const answer = (value: "yes" | "no") => {
    writeConsent(value);
    setAsking(false);
    if (value === "yes") void startAnalytics();
  };
  const button = "inline-flex min-h-11 items-center justify-center rounded-full px-5 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  return (
    <section
      role="region"
      aria-label="Analytics"
      data-testid="analytics-consent"
      className="fixed inset-x-3 bottom-3 z-[75] mx-auto max-w-2xl rounded-2xl border border-white/20 bg-space-2/95 p-4 shadow-2xl shadow-black/60 backdrop-blur sm:p-5"
    >
      <p className="text-base text-white/90">
        May we record which pages you open and which missions you fly, and a replay of how the page looked, to make the game better? Typed text is never recorded.{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Read the privacy page
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-3">
        <button type="button" data-testid="analytics-yes" onClick={() => answer("yes")} className={`${button} bg-amber text-space`}>
          Yes, help out
        </button>
        <button type="button" data-testid="analytics-no" onClick={() => answer("no")} className={`${button} border border-white/30 text-white hover:bg-white/10`}>
          No thanks
        </button>
      </div>
    </section>
  );
}
