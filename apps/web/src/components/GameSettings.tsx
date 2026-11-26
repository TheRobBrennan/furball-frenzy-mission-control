"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import AnalyticsPreference from "./AnalyticsPreference";

export default function GameSettings() {
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = button.current;
    const popup = panel.current;
    if (!trigger || !popup) return;

    const position = () => {
      const bounds = trigger.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const gutter = 12;
      const width = Math.min(320, viewportWidth - 2 * gutter);
      const top = Math.max(gutter, Math.min(bounds.bottom + 8, viewportHeight - 136));
      const left = Math.max(gutter, Math.min(bounds.right - width, viewportWidth - width - gutter));
      popup.style.inset = `${top}px auto auto ${left}px`;
      popup.style.width = `${width}px`;
      popup.style.maxHeight = `${viewportHeight - top - gutter}px`;
    };
    const repositionIfOpen = () => {
      if (popup.matches(":popover-open")) position();
    };
    popup.addEventListener("beforetoggle", position);
    window.addEventListener("resize", repositionIfOpen);
    window.addEventListener("scroll", repositionIfOpen, { passive: true });
    return () => {
      popup.removeEventListener("beforetoggle", position);
      window.removeEventListener("resize", repositionIfOpen);
      window.removeEventListener("scroll", repositionIfOpen);
    };
  }, []);

  return (
    <>
      <button
        ref={button}
        type="button"
        popoverTarget="game-settings"
        aria-label="Settings"
        title="Settings"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-amber hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
      >
        <span aria-hidden="true" className="text-2xl leading-none">⚙</span>
      </button>
      <section
        ref={panel}
        id="game-settings"
        popover="auto"
        aria-labelledby="game-settings-title"
        className="fixed inset-auto right-3 top-14 m-0 w-80 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-white/25 bg-space p-4 text-white shadow-xl shadow-black/60"
      >
        <h2 id="game-settings-title" className="text-base font-bold">Settings</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm">Anonymous analytics</span>
          <AnalyticsPreference />
        </div>
        <nav aria-label="Legal" className="mt-2 flex flex-wrap gap-x-4 text-sm text-amber">
          <Link href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4">
            Privacy policy
          </Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center underline underline-offset-4">
            Terms of use
          </Link>
        </nav>
      </section>
    </>
  );
}
