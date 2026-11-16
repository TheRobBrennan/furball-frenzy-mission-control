"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { caseLabel, hashTarget } from "@/lib/binder";
import SadElephants from "./SadElephants";

type Tab = { id: string; label: string; color: string; side: string };

// Binder tabs for the page, in page order. The colored edges are the dividers of the elephants' binder.
const tabs: Tab[] = [
  { id: "top", label: "Cover", color: "border-t-[#f472b6]", side: "border-l-[#f472b6]" },
  { id: "the-brief", label: "The brief", color: "border-t-[#5ac8fa]", side: "border-l-[#5ac8fa]" },
  { id: "classified", label: "Classified", color: "border-t-[#c792ea]", side: "border-l-[#c792ea]" },
  { id: "launch-sites", label: "Launch sites", color: "border-t-[#ff7a59]", side: "border-l-[#ff7a59]" },
  { id: "origin-stories", label: "Origin stories", color: "border-t-[#7ddc8a]", side: "border-l-[#7ddc8a]" },
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
const ROLL_MS = 2800;

/** On a phone, or with reduced motion, the case opens at once: no roller, no long wait, nothing for iOS Safari to fight with. */
const quick = (): boolean => window.innerWidth < 640 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scrolls to a section, or to the very top. On a phone it jumps, because iOS Safari cancels a smooth scroll the moment the menu above it collapses. */
function scrollToId(id: string) {
  const reduced = quick();
  // The top of the page is the very top, so the hero keeps the breathing room it has on first load,
  // instead of sliding up under the sticky menu.
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    history.replaceState(null, "", window.location.pathname);
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export default function MissionNav() {
  const [active, setActive] = useState("top");
  const [menu, setMenu] = useState(false);
  // The binder starts closed, only the cover and the footer show until the visitor opens the case.
  // `opened` remembers that they have, so the button says Reopen after that.
  const [closed, setClosed] = useState(true);
  const [opened, setOpened] = useState(false);
  // A red stamp slams down when the case is closed.
  const [stamp, setStamp] = useState(0);
  const [check, setCheck] = useState<{ q: string; a: string[] } | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  // After "Let me through", the elephants take it to heart: sad, then maybe forgiven.
  const [feelings, setFeelings] = useState<null | "sad" | "forgiven" | "sniffle">(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const sorry = useRef<HTMLButtonElement>(null);
  const onward = useRef<HTMLButtonElement>(null);
  const firstAnswer = useRef<HTMLButtonElement>(null);

  // Which tab is lit follows where the visitor is on the page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // The cover is where you are until another section reaches the top.
      let current = "top";
      for (const t of tabs.slice(1)) {
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

  useEffect(() => {
    if (done) onward.current?.focus();
  }, [done]);

  const setBinder = useCallback((shut: boolean) => {
    // The first paint is already closed, with no roller or transition. Once the visitor acts, the
    // case animates like it always has.
    delete document.documentElement.dataset.binderFirst;
    document.documentElement.dataset.binder = shut ? "closed" : "open";
    setClosed(shut);
    if (!shut) setOpened(true);
  }, []);

  // A link such as /#origin-stories opens the case, then scrolls to that section once it has unrolled.
  // It runs on arrival and whenever the hash changes, for example the hero's Start the mission button.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scroll: number | undefined;
    const openForHash = () => {
      const ids = Array.from(document.querySelectorAll(".binder [id]"), (el) => el.id);
      const target = hashTarget(window.location.hash, ids);
      if (!target) return;
      setBinder(false);
      window.clearTimeout(scroll);
      scroll = window.setTimeout(() => scrollToId(target), reduced || quick() ? 80 : ROLL_MS + 100);
    };
    const raf = window.requestAnimationFrame(openForHash);
    window.addEventListener("hashchange", openForHash);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", openForHash);
      window.clearTimeout(scroll);
    };
  }, [setBinder]);

  // The binder is a long scroll: closing rolls it up from the bottom, opening unfurls it from the top.
  // The roller rides the bottom edge, and the view follows that edge so the whole thing can be seen.
  const followRoller = useCallback((ms: number, where: number) => {
    const binder = document.querySelector(".binder");
    if (!binder) return;
    const start = performance.now();
    const step = (now: number) => {
      const edge = binder.getBoundingClientRect().bottom;
      window.scrollTo(0, Math.max(0, window.scrollY + (edge - window.innerHeight * where)));
      if (now - start < ms) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const toggleBinder = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu(false);
      if (quick()) {
        if (!closed) setStamp((n) => n + 1);
        setBinder(!closed);
        window.scrollTo(0, 0);
        return;
      }
      if (!closed) {
        // Start at the bottom of the scroll, then roll it up toward the top.
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        window.setTimeout(() => {
          setBinder(true);
          followRoller(ROLL_MS, 0.62);
          window.setTimeout(() => setStamp((n) => n + 1), ROLL_MS);
          // Once it is rolled up, the visitor lands back at the top, on the cover.
          window.setTimeout(() => scrollToId("top"), ROLL_MS + 150);
        }, 750);
      } else {
        // Start at the top, then unfurl it downward, and come back to the cover when it lands. Already at the top, it starts at once.
        const atTop = window.scrollY < 40;
        if (!atTop) window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(() => {
          setBinder(false);
          followRoller(ROLL_MS, 0.5);
          window.setTimeout(() => scrollToId("top"), ROLL_MS + 250);
        }, atTop ? 0 : 500);
      }
    },
    [closed, setBinder, followRoller],
  );

  const go = useCallback((event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setMenu(false);
    if (closed && id !== "top") {
      // A tab on a closed binder opens it first.
      setBinder(false);
      window.setTimeout(() => scrollToId(id), quick() ? 80 : 2900);
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (id === "classified" && !seen) {
      setReaction(null);
      setFeelings(null);
      setDone(false);
      setCheck(checkpoints[Math.floor(Math.random() * checkpoints.length)]);
      return;
    }
    // After the menu has closed and the page has settled, so the scroll is not cancelled by the layout changing under it.
    window.setTimeout(() => scrollToId(id), 80);
  }, [closed, setBinder]);

  const markSeen = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // The checkpoint just shows again next time, that is fine.
    }
  };

  // The elephants' last word stays up until the visitor has read it and chooses to go on.
  const proceed = useCallback(() => {
    setCheck(null);
    setReaction(null);
    setFeelings(null);
    setReady(false);
    setDone(false);
    scrollToId("classified");
  }, []);

  const answer = useCallback(() => {
    markSeen();
    setReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setDone(true);
  }, []);

  // "Let me through" is a little rude, and the elephants are sensitive about it.
  const rude = useCallback(() => {
    setReady(false);
    setFeelings("sad");
  }, []);

  const apologize = useCallback(() => {
    markSeen();
    setFeelings("forgiven");
    setDone(true);
  }, []);

  const goAnyway = useCallback(() => {
    markSeen();
    setFeelings("sniffle");
    setDone(true);
  }, []);

  return (
    <>
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
          <li className="ml-3">
            <a
              href="#footer"
              onClick={toggleBinder}
              className={`case-pulse block w-[9.5rem] rounded-t-lg border border-b-0 border-t-4 border-white/10 bg-white/5 px-2 py-2 text-center font-mono text-xs text-white/80 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber ${
                closed && !opened ? "border-t-amber text-white" : "border-t-[#94a3b8]"
              }`}
            >
              {caseLabel(closed, opened)}
            </a>
          </li>
        </ul>
        <button
          type="button"
          aria-expanded={menu}
          aria-controls="mission-menu-sheet"
          onClick={() => setMenu((v) => !v)}
          className="case-pulse mb-2 rounded-lg bg-amber px-3 py-1.5 font-mono text-xs font-semibold text-space sm:hidden"
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
          <li>
            <a
              href="#footer"
              onClick={toggleBinder}
              className="block rounded-lg border border-l-4 border-white/10 border-l-[#94a3b8] bg-white/5 px-4 py-3 font-semibold text-white/90"
            >
              {caseLabel(closed, opened)}
            </a>
          </li>
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
                  {done && (
                    <button
                      ref={onward}
                      type="button"
                      onClick={proceed}
                      className="fade-line mt-4 block w-full rounded-lg border border-amber/60 bg-amber/15 px-3 py-2 text-left text-sm font-semibold text-amber hover:bg-amber/25"
                    >
                      Open the files
                    </button>
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
                <div className="mt-2" role="status">
                  <p className="text-white/90">{reaction}</p>
                  <button
                    ref={onward}
                    type="button"
                    onClick={proceed}
                    className="fade-line mt-4 block w-full rounded-lg border border-amber/60 bg-amber/15 px-3 py-2 text-left text-sm font-semibold text-amber hover:bg-amber/25"
                  >
                    Open the files
                  </button>
                </div>
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
      {stamp > 0 && (
        <div
          key={stamp}
          aria-hidden="true"
          onAnimationEnd={() => setStamp(0)}
          className="case-stamp pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="block -rotate-6 whitespace-nowrap rounded-md border-[6px] border-[#e9072b] px-6 py-2 font-mono text-3xl font-black uppercase tracking-[0.2em] text-[#e9072b] sm:text-6xl">
            Case closed
          </span>
        </div>
      )}
    </>
  );
}
