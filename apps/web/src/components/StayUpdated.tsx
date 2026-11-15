"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { formId, showForm } from "@/lib/updates";

/**
 * A friendly invitation to sign up for updates. The button opens a pop-up with the Flodesk form in it, closable with the button, Escape,
 * or a click outside. Nothing loads from Flodesk before the pop-up opens.
 */
export default function StayUpdated({ id = formId() }: { id?: string | null }) {
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
      <section aria-label="Stay updated" data-testid="stay-updated" className="mx-auto my-6 w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-amber/40 bg-amber/10 p-5 text-center">
        <h2 className="text-xl font-black text-white">Stay updated</h2>
        <p className="mt-1 text-base text-white/85">Want the Furball Frenzy and the adventures of the Polish elephants and family in your inbox?</p>
        <button
          ref={opener}
          type="button"
          data-testid="stay-updated-open"
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Send me the updates
        </button>
      </section>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close} data-testid="stay-updated-backdrop">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sign up for updates"
            data-testid="stay-updated-dialog"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-white/20 bg-space-2 p-3 shadow-2xl shadow-black/60 sm:p-4"
          >
            <button
              ref={closeButton}
              type="button"
              data-testid="stay-updated-close"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/10 text-xl font-bold text-black hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              &times;
            </button>
            <div id={container} data-testid="stay-updated-form" className="min-h-40 overflow-hidden rounded-2xl bg-white text-black" />
            <p className="mt-3 px-2 text-center text-xs text-white/70">Your email goes to Flodesk, our email service, and nowhere else. Unsubscribe from any email. See the privacy page.</p>
          </div>
        </div>
      )}
    </>
  );
}
