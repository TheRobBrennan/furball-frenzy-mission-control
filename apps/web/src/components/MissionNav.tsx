"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SadElephants from "./SadElephants";

type Tab = { id: string; label: string; color: string; side: string };

// Binder tabs for the page, in page order. The colored edges are the dividers of the elephants' binder.
const tabs: Tab[] = [
  { id: "story", label: "The brief", color: "border-t-[#5ac8fa]", side: "border-l-[#5ac8fa]" },
  { id: "classified", label: "Classified", color: "border-t-[#c792ea]", side: "border-l-[#c792ea]" },
  { id: "crew", label: "Launch sites", color: "border-t-[#ff7a59]", side: "border-l-[#ff7a59]" },
  { id: "stories", label: "Origin stories", color: "border-t-[#7ddc8a]", side: "border-l-[#7ddc8a]" },
];

// Every question has three good answers. The elephants let everyone through, it is only whimsy.
const checkpoints = [
  { q: "What is the best snack for a moon mission?", a: ["Space ice cream", "Anything with a bunny", "A very serious sandwich"] },
  { q: "Who looks after the binder?", a: ["The elephants", "Piggy, who borrows it", "It is classified"] },
  { q: "What do furballs put first?", a: ["Safety and silliness", "Silliness and safety", "Snacks"] },
];
const reactions = [
  "Cleared. The elephants are unimpressed, but allow it.",
  "Cleared. Clearance level: charmed.",
  "Cleared. The elephants nod, very seriously.",
];

const SEEN_KEY = "ff-elephants-cleared";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export default function MissionNav() {
  const [active, setActive] = useState("story");
  const [menu, setMenu] = useState(false);
  const [check, setCheck] = useState<{ q: string; a: string[] } | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  // After "Let me through", the elephants take it to heart: sad, then maybe forgiven.
  const [feelings, setFeelings] = useState<null | "sad" | "forgiven" | "sniffle">(null);
  const [ready, setReady] = useState(false);
  const sorry = useRef<HTMLButtonElement>(null);
  const firstAnswer = useRef<HTMLButtonElement>(null);

  // Which tab is lit follows where the visitor is on the page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = tabs[0].id;
      for (const t of tabs) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= 140) current = t.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCheck(null);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (check && !feelings) firstAnswer.current?.focus();
  }, [check, feelings]);

  // The buttons wait a moment so the elephants get to say what they feel.
  useEffect(() => {
    if (feelings !== "sad") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setReady(true), reduced ? 0 : 2600);
    return () => window.clearTimeout(id);
  }, [feelings]);

  useEffect(() => {
    if (ready) sorry.current?.focus();
  }, [ready]);

  const go = useCallback((event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setMenu(false);
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (id === "classified" && !seen) {
      setReaction(null);
      setCheck(checkpoints[Math.floor(Math.random() * checkpoints.length)]);
      return;
    }
    scrollToId(id);
  }, []);

  const markSeen = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // The checkpoint just shows again next time, that is fine.
    }
  };

  const finish = useCallback((delay: number) => {
    window.setTimeout(() => {
      setCheck(null);
      setReaction(null);
      setFeelings(null);
      setReady(false);
      scrollToId("classified");
    }, delay);
  }, []);

  const answer = useCallback(() => {
    markSeen();
    setReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    finish(1100);
  }, [finish]);

  // "Let me through" is a little rude, and the elephants are sensitive about it.
  const rude = useCallback(() => {
    setReady(false);
    setFeelings("sad");
  }, []);

  const apologize = useCallback(() => {
    markSeen();
    setFeelings("forgiven");
    finish(1800);
  }, [finish]);

  const goAnyway = useCallback(() => {
    markSeen();
    setFeelings("sniffle");
    finish(1500);
  }, [finish]);

  return (
    <nav
      aria-label="Mission menu"
      className="sticky top-0 z-40 border-b border-white/10 bg-space/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 px-4 pt-2 sm:px-6">
        <a
          href="#top"
          onClick={(e) => go(e, "top")}
          className="pb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        >
          Furball Frenzy
        </a>
        <ul className="hidden items-end gap-1 sm:flex">
          {tabs.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={(e) => go(e, t.id)}
                aria-current={active === t.id ? "location" : undefined}
                className={`block rounded-t-lg border border-b-0 border-t-4 border-white/10 px-4 py-2 font-mono text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber ${t.color} ${
                  active === t.id ? "bg-amber text-space" : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-expanded={menu}
          aria-controls="mission-menu-sheet"
          onClick={() => setMenu((v) => !v)}
          className="mb-2 rounded-lg bg-amber px-3 py-1.5 font-mono text-xs font-semibold text-space sm:hidden"
        >
          {menu ? "Close" : "Mission menu"}
        </button>
      </div>

      {menu && (
        <ul id="mission-menu-sheet" className="space-y-2 border-t border-white/10 px-4 pb-4 pt-3 sm:hidden">
          {tabs.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={(e) => go(e, t.id)}
                aria-current={active === t.id ? "location" : undefined}
                className={`block rounded-lg border border-l-4 border-white/10 bg-white/5 px-4 py-3 font-semibold ${t.side} ${
                  active === t.id ? "text-amber" : "text-white/90"
                }`}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {check && (
        <div
          role="dialog"
          aria-label="Elephant checkpoint"
          className="absolute inset-x-0 top-full mx-auto mt-2 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-amber/60 bg-space-2 p-5 shadow-2xl shadow-black/60"
        >
          <div className="flex items-start gap-4">
            {!feelings && (
              <Image
                src="/images/elephants-on-green.jpg"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-amber object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber">Elephant checkpoint</p>
              {feelings ? (
                <div className="mt-2" role="status" aria-live="polite">
                  <SadElephants mood={feelings === "forgiven" ? "happy" : "sad"} />
                  {feelings === "sad" && (
                    <div className="mt-3 space-y-1.5 text-sm text-white/85">
                      <p className="fade-line">Oh.</p>
                      <p className="fade-line" style={{ animationDelay: "0.9s" }}>
                        We were only trying to share information appropriately.
                      </p>
                      <p className="fade-line" style={{ animationDelay: "1.8s" }}>
                        It is our responsibility, and we take it to heart.
                      </p>
                    </div>
                  )}
                  {feelings === "forgiven" && (
                    <p className="fade-line mt-3 text-sm text-white/90">Apology accepted. Clearance level: forgiven.</p>
                  )}
                  {feelings === "sniffle" && (
                    <p className="fade-line mt-3 text-sm text-white/70">*sniffle* Go on, then. We understand.</p>
                  )}
                  {feelings === "sad" && ready && (
                    <div className="fade-line mt-4 flex flex-col gap-2">
                      <button
                        ref={sorry}
                        type="button"
                        onClick={apologize}
                        className="rounded-lg border border-amber/60 bg-amber/15 px-3 py-2 text-left text-sm font-semibold text-amber hover:bg-amber/25"
                      >
                        I&apos;m sorry, elephants
                      </button>
                      <button
                        type="button"
                        onClick={goAnyway}
                        className="rounded-lg px-3 py-2 text-left font-mono text-xs text-white/50 underline decoration-white/25 underline-offset-4 hover:text-white/80"
                      >
                        Go in anyway
                      </button>
                    </div>
                  )}
                </div>
              ) : reaction ? (
                <p className="mt-2 text-white/90" role="status">
                  {reaction}
                </p>
              ) : (
                <>
                  <p className="mt-2 font-semibold">{check.q}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {check.a.map((choice, i) => (
                      <button
                        key={choice}
                        ref={i === 0 ? firstAnswer : undefined}
                        type="button"
                        onClick={answer}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
                      >
                        {choice}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={rude}
                      className="rounded-lg px-3 py-2 text-left font-mono text-xs text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white"
                    >
                      Let me through
                    </button>
                  </div>
                </>
              )}
            </div>
            {!reaction && !feelings && (
              <button
                type="button"
                aria-label="Close the checkpoint"
                onClick={() => setCheck(null)}
                className="ml-auto shrink-0 rounded-md px-2 text-white/60 hover:text-white"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
