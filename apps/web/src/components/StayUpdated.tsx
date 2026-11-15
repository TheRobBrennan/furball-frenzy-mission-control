"use client";

import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { formId, showForm } from "@/lib/updates";

/** A friendly box to sign up for updates. The Flodesk form appears inside it when asked, and nothing loads from Flodesk before that. */
export default function StayUpdated({ id = formId() }: { id?: string | null }) {
  const [open, setOpen] = useState(false);
  // Someone who just signed up does not need to be asked again on the thank you page.
  const pathname = usePathname();
  const container = `fd-${useId().replace(/[^a-z0-9]/gi, "")}`;
  if (!id || pathname === "/thanks") return null;
  const ask = () => {
    setOpen(true);
    // The container is on screen on the next frame, and Flodesk fills it.
    window.requestAnimationFrame(() => showForm(id, container));
  };
  return (
    <section aria-label="Stay updated" data-testid="stay-updated" className="mx-auto my-6 w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-amber/40 bg-amber/10 p-5 text-center">
      <h2 className="text-xl font-black text-white">Stay updated</h2>
      <p className="mt-1 text-base text-white/85">Want the Furball Frenzy and the adventures of the Polish elephants and family in your inbox? Sign up and we will send an update now and then.</p>
      {!open && (
        <button
          type="button"
          data-testid="stay-updated-open"
          onClick={ask}
          className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space shadow-lg shadow-amber/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Send me the updates
        </button>
      )}
      {open && <div id={container} data-testid="stay-updated-form" className="mt-3 min-h-24 rounded-xl bg-white p-2 text-left text-black" />}
      <p className="mt-2 text-xs text-white/60">
        Your email goes to Flodesk, our email service, and nowhere else. Unsubscribe from any email. See the privacy page.
      </p>
    </section>
  );
}
