"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import Furball from "@/components/characters/Furballs";
import { formId, showForm } from "@/lib/updates";

/** The crew that waves from the invitation, the elephants always first. */
const crew = [
  { who: "elephants", label: "The Polish elephants" },
  { who: "piggy", label: "Piggy" },
  { who: "hamley", label: "Hamley" },
  { who: "blue-bear", label: "Blue Bear" },
  { who: "little-bear", label: "Little Bear" },
  { who: "little-duck", label: "Little Duck" },
] as const;

/**
 * An invitation to get the dispatches, the news, missions, games, and mischief of the furballs and the two Polish elephants.
 * The button opens a pop-up with the Flodesk form in it, closable with the button, Escape, or a click outside. Nothing loads
 * from Flodesk before the pop-up opens.
 */
export default function StayUpdated({ id = formId(), compact = false }: { id?: string | null; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  // Someone who just signed up does not need to be asked again on the thank you page.
  const pathname = usePathname();
  const container = `fd-${useId().replace(/[^a-z0-9]/gi, "")}`;
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !id) return;
    closeButton.current?.focus();
    const frame = window.requestAnimationFrame(() => showForm(id, container));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, id, container]);

  if (!id || pathname === "/thanks") return null;
  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };
  return (
    <>
      <section
        aria-label="Stay updated"
        data-testid="stay-updated"
        className={`relative overflow-hidden rounded-3xl border border-amber/40 bg-gradient-to-br from-amber/15 via-space-2 to-ember/10 text-center shadow-xl shadow-black/30 ${
          compact ? "mt-6 w-full p-4" : "mx-auto mb-8 mt-4 w-[calc(100%-2rem)] max-w-3xl p-6 sm:p-8"
        }`}
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4" aria-hidden="true" data-testid="stay-updated-crew">
          {crew.map((c) => (
            <Furball key={c.who} who={c.who} label={c.label} waving={c.who === "elephants"} className={`shrink-0 ${compact ? "h-9 w-9" : "h-11 w-11 sm:h-14 sm:w-14"} ${c.who === "elephants" ? (compact ? "w-14" : "w-16 sm:w-20") : ""}`} />
          ))}
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-amber">Dispatches from Mission Control</p>
        <h2 className={`mt-1 font-black text-white ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>Join the furball crew</h2>
        <p data-testid="stay-updated-line" className={`mx-auto mt-2 max-w-xl text-balance text-white/85 ${compact ? "text-sm" : "text-base sm:text-lg"}`}>
          The latest news, missions, games, and mischievous adventures of the furballs and those two Polish elephants.
        </p>
        <button
          ref={opener}
          type="button"
          data-testid="stay-updated-open"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Send me the dispatches
        </button>
        <p className="mt-2 text-xs text-white/60">Now and then, never spam. Unsubscribe any time.</p>
      </section>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close} data-testid="stay-updated-backdrop">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sign up for the dispatches"
            data-testid="stay-updated-dialog"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-space-2 p-3 shadow-2xl shadow-black/60 sm:p-4"
          >
            <button
              ref={closeButton}
              type="button"
              data-testid="stay-updated-close"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              &times;
            </button>
            {/* A friendly line shows behind the form while Flodesk loads, and the form, which has its own navy background, covers it. */}
            <div className="relative min-h-52">
              <p data-testid="stay-updated-loading" className="absolute inset-0 flex items-center justify-center text-center text-base text-white/70 motion-safe:animate-pulse">
                The furballs are warming up the sign-up form...
              </p>
              <div id={container} data-testid="stay-updated-form" className="relative min-h-52 overflow-hidden rounded-2xl" />
            </div>
            <p className="mt-3 px-2 text-center text-xs text-white/70">
              We send a quick email to confirm it is really you. Your email goes to Flodesk, our email service, and nowhere else. See the privacy page.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
