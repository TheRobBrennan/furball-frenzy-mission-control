"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Furball from "@/components/characters/Furballs";
import SceneArt from "@/components/mission/SceneArt";
import { reducedMotion } from "@/lib/motion";

export const PROMO_KEY = "ff-promo-seen";

const captions = ["Two Polish elephants.", "One lifelong dream.", "A rover bound for the Moon.", "Design the mission that gets them there."];

/** How long each caption of the little trailer stays up, in milliseconds. */
export const CAPTION_MS = 2400;

const seen = (): boolean => {
  try {
    return window.sessionStorage.getItem(PROMO_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * A short trailer shown once per visit as a pop-up: the rocket lifts off, the Polish elephants wave, and four lines say what the game is.
 * It closes with the button, Escape, or a click outside, it is phone friendly, and with reduced motion it is still, with every line shown.
 */
export default function PromoSplash() {
  const [open, setOpen] = useState(false);
  const [still] = useState(() => reducedMotion());
  const [line, setLine] = useState(0);
  const closeButton = useRef<HTMLButtonElement>(null);

  // It appears a moment after the page loads, unless the visitor has already seen it this visit.
  useEffect(() => {
    // The link /?trailer plays it again, even in a visit that already saw it.
    const forced = new URLSearchParams(window.location.search).has("trailer");
    if (seen() && !forced) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    try {
      window.sessionStorage.setItem(PROMO_KEY, "1");
    } catch {
      // Storage is blocked, so it may show again on the next visit, which is fine.
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // The captions advance on their own, and stop on the last one.
  useEffect(() => {
    if (!open || still || line >= captions.length - 1) return;
    const t = window.setTimeout(() => setLine((n) => n + 1), CAPTION_MS);
    return () => window.clearTimeout(t);
  }, [open, still, line]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close} data-testid="promo-backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Furball Frenzy trailer"
        data-testid="promo"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-space-2 p-4 shadow-2xl shadow-black/60 sm:p-6"
      >
        <button
          ref={closeButton}
          type="button"
          data-testid="promo-close"
          onClick={close}
          aria-label="Close the trailer"
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        >
          &times;
        </button>
        <SceneArt kind="liftoff" mood="cheer" animate={!still} speed={0.7} />
        <div className="mt-3 flex justify-center gap-3" aria-hidden="true">
          <Furball who="elephants" label="The Polish elephants" waving={!still} className="h-16 w-16" />
          <Furball who="piggy" label="Piggy" className="h-16 w-16" />
        </div>
        <div className="mt-3 min-h-[4.5rem] text-center" aria-live="polite" data-testid="promo-line">
          {still ? (
            <p className="text-lg font-bold text-white">{captions.join(" ")}</p>
          ) : (
            <p key={line} className="text-xl font-black text-white motion-safe:animate-pulse">
              {captions[line]}
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <a
            href="/mission?judges=1"
            onClick={close}
            className="inline-flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-amber px-6 text-center font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Watch a mission
          </a>
          <a
            href="/mission"
            onClick={close}
            className="inline-flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-white/30 px-6 text-center font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Design it myself
          </a>
        </div>
      </div>
    </div>
  );
}
