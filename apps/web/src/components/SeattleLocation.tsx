"use client";

import { useEffect, useRef, useState } from "react";
import ExtLink from "./ExtLink";
import ReconPolaroid from "./ReconPolaroid";
import ZamboniModel from "./ZamboniModel";
import { skins } from "./ZamboniSkins";

// Kraken Bear, a black bear in a plain white hoodie. He fades in, smiles, then runs off. An original
// drawing, no team logos.
function KrakenBear() {
  return (
    <svg viewBox="0 0 80 76" role="img" aria-label="Kraken Bear, a black bear in a white hoodie" className="h-full w-auto">
      <g className="kb-bob">
        <ellipse cx="40" cy="62" rx="24" ry="15" fill="#f4f7fb" stroke="#050816" strokeWidth="2.5" />
        <path d="M 22,52 Q 40,66 58,52" fill="none" stroke="#9fb3c8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="21" cy="22" r="9" fill="#1a1d27" stroke="#050816" strokeWidth="2.5" />
        <circle cx="59" cy="22" r="9" fill="#1a1d27" stroke="#050816" strokeWidth="2.5" />
        <circle cx="21" cy="23" r="4" fill="#3a3f4d" />
        <circle cx="59" cy="23" r="4" fill="#3a3f4d" />
        <circle cx="40" cy="38" r="24" fill="#1a1d27" stroke="#050816" strokeWidth="2.5" />
        <ellipse cx="40" cy="47" rx="12" ry="9" fill="#8a7a66" />
        <ellipse cx="40" cy="42" rx="4.6" ry="3.2" fill="#050816" />
        <circle cx="30" cy="34" r="3.4" fill="#fff" />
        <circle cx="50" cy="34" r="3.4" fill="#fff" />
        <circle cx="30.6" cy="34.4" r="1.8" fill="#050816" />
        <circle cx="50.6" cy="34.4" r="1.8" fill="#050816" />
        <path className="kb-neutral" d="M 34,52 Q 40,52 46,52" fill="none" stroke="#050816" strokeWidth="2.2" strokeLinecap="round" />
        <path className="kb-smile" d="M 32,50 Q 40,60 48,50" fill="none" stroke="#050816" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Seattle's launch site, as two polaroids: a satellite look at the arena in a sonar-and-deep-sea
// style that Enhance zooms into, and a rink where a Zamboni resurfaces the ice in a rotating set of
// skins while Kraken Bear follows it, slips, and spins off. The show cycles on its own while it is on
// screen, and a click on the machine opens that skin's website in a new tab.
export default function SeattleLocation() {
  const holder = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [run, setRun] = useState(0);
  const [skinIndex, setSkinIndex] = useState(0);
  // The ice show runs left to right, then right to left, so the skins show on both sides.
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const skin = skins[skinIndex];

  const next = () => {
    setSeen(true);
    setSkinIndex((i) => (i + 1) % skins.length);
    setDir((d) => (d === "ltr" ? "rtl" : "ltr"));
    setRun((n) => n + 1);
  };

  useEffect(() => {
    const el = holder.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
          if (e.isIntersecting) setSeen(true);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While the rink is on screen, the next skin takes the ice when the show is over.
  useEffect(() => {
    if (!inView || !seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(next, 16500);
    return () => window.clearTimeout(id);
  }, [inView, seen, run]);

  const polaroid = "polaroid rounded-md bg-white p-2.5 pb-3 shadow-2xl shadow-black/60";
  const caption = "mt-2 text-center font-mono text-[0.65rem] font-semibold leading-snug text-space";

  return (
    <div ref={holder} className="mt-6 flex flex-col">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-0 lg:min-h-[340px]">
        <ReconPolaroid
          src="/images/seattle-center-satellite.jpg"
          alt="A satellite view of Climate Pledge Arena and Seattle Center, the arena's roof in the middle"
          readout={"47.6221\u00b0 N, 122.3540\u00b0 W"}
          caption="Climate Pledge Arena"
          className="z-0 w-[66%] sm:w-[41%]"
        />

        {/* the ice polaroid */}
        <figure className={`${polaroid} relative z-10 w-[92%] sm:-ml-[3%] sm:mt-12 sm:w-[60%]`} style={{ ["--tilt" as string]: "2.5deg" }}>
          <div
            key={run}
            className={`rink relative aspect-[16/10] overflow-hidden rounded-sm bg-gradient-to-b from-[#d8eef5] to-[#f3fbfe] ${seen ? "rink-go" : ""}`}
          >
            <div className={`absolute inset-0 ${dir === "rtl" ? "-scale-x-100" : ""}`}>
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[#1d3b52]" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-[#1d3b52]" />
              <div aria-hidden="true" className="absolute inset-y-1.5 left-[16%] w-1.5 bg-[#2f6fd6]/60" />
              <div aria-hidden="true" className="wet absolute inset-y-1.5 left-0 right-0 bg-gradient-to-b from-white/80 via-[#bfe6f7]/75 to-white/80 shadow-[inset_0_0_10px_rgba(255,255,255,0.9)]" />
              <div className="zam absolute top-1/2 h-[64%] -translate-y-1/2">
                <a
                  href={skin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${skin.name} in a new tab`}
                  title={`Open ${skin.name}`}
                  className="block h-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9072b]"
                >
                  <ZamboniModel skin={skin} flipText={dir === "rtl"} />
                </a>
              </div>
              <div className="kb absolute top-1/2 h-[46%] -translate-y-1/2">
                <KrakenBear />
              </div>
            </div>
            <button
              type="button"
              onClick={next}
              className="absolute bottom-3 right-2 z-10 rounded-md border border-[#355464]/70 bg-[#001628]/80 px-2.5 py-1 font-mono text-[0.7rem] font-semibold text-[#e9fbfb] hover:bg-[#001628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9072b]"
            >
              Chase the Zamboni
            </button>
          </div>
          <figcaption className={caption} aria-live="polite">
            Zamboni skin: <ExtLink href={skin.href} onLight>{skin.short ?? skin.name}</ExtLink>
          </figcaption>
        </figure>
      </div>
      <p className="mx-auto mt-6 max-w-sm text-balance text-center text-xs leading-relaxed text-white/55">
        Recon by two unnamed Polish elephants.
        <br />
        Imagery: USGS The National Map, orthoimagery.
      </p>
    </div>
  );
}
