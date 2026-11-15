"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

// An ice resurfacer, the machine that smooths the rink between periods. An original drawing.
function Zamboni() {
  return (
    <svg viewBox="0 0 112 60" role="img" aria-label="An ice resurfacer" className="h-full w-auto">
      <rect x="6" y="22" width="76" height="26" rx="5" fill="#e9f2f8" stroke="#050816" strokeWidth="2.5" />
      <rect x="6" y="36" width="76" height="5" fill="#355464" />
      <path d="M 78,24 L 78,10 Q 78,6 83,6 L 98,6 Q 104,6 106,12 L 108,24 Z" fill="#e9f2f8" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 83,10 L 98,10 L 102,22 L 83,22 Z" fill="#6e8299" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
      <rect x="86" y="1" width="8" height="5" rx="2" fill="#ff9f1c" stroke="#050816" strokeWidth="1.5" className="zam-beacon" />
      <rect x="96" y="30" width="12" height="18" rx="3" fill="#e9f2f8" stroke="#050816" strokeWidth="2.5" />
      <circle cx="24" cy="50" r="8" fill="#1a1d27" stroke="#050816" strokeWidth="2.5" />
      <circle cx="24" cy="50" r="3" fill="#9aa8ba" />
      <circle cx="94" cy="50" r="8" fill="#1a1d27" stroke="#050816" strokeWidth="2.5" />
      <circle cx="94" cy="50" r="3" fill="#9aa8ba" />
      <path d="M 4,40 Q -2,44 -6,50" fill="none" stroke="#bfe6f7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

// Seattle's launch site: a satellite look at the arena, in a sonar-and-deep-sea style, with a little
// show on the ice below it, Kraken Bear appears, smiles, and chases the ice resurfacer off the rink.
export default function SeattleLocation() {
  const holder = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [tilted, setTilted] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={holder} className="mt-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#68a2b9]/50 bg-[#001628]">
        <div className="relative aspect-[16/10]">
          <div className={`recon-img absolute inset-0 ${tilted ? "recon-tilt" : ""}`}>
            <Image
              src="/images/seattle-center-satellite.jpg"
              alt="A satellite view of Climate Pledge Arena and Seattle Center, the arena's roof in the middle"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
            />
          </div>
          {/* a deep-sea tint, a faint grid, and the sonar */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#00334d]/45 mix-blend-multiply" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(153,217,217,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(153,217,217,0.35) 1px, transparent 1px)",
              backgroundSize: "12.5% 12.5%",
            }}
          />
          <div aria-hidden="true" className="sonar absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <span className="sonar-ring" />
            <span className="sonar-ring sonar-ring-2" />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9072b]" />
          </div>
          <div aria-hidden="true" className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-[#99d9d9]" />
          <div aria-hidden="true" className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-[#99d9d9]" />
          <div aria-hidden="true" className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#99d9d9]" />
          <div aria-hidden="true" className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#99d9d9]" />
          <p className="absolute left-4 top-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#99d9d9] sm:text-xs">
            Sonar contact
          </p>
          <p className="absolute bottom-4 left-4 font-mono text-[0.65rem] text-[#e9fbfb] sm:text-sm">
            47.6221&deg; N, 122.3540&deg; W
          </p>
          <p className="absolute bottom-4 right-4 text-right font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#99d9d9] sm:text-xs">
            Climate Pledge Arena
          </p>
        </div>

        {/* the ice: a rink strip where the show happens */}
        <div key={run} className={`rink relative h-14 overflow-hidden bg-gradient-to-b from-[#d8eef5] to-[#f3fbfe] sm:h-16 ${seen ? "rink-go" : ""}`}>
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-[#e9072b]/50" />
          <div className="zam absolute bottom-1 h-11 sm:h-12">
            <Zamboni />
          </div>
          <div className="kb absolute bottom-0.5 h-12 sm:h-14">
            <KrakenBear />
          </div>
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/55">
        <span>
          Recon by two unnamed Polish elephants. Imagery: USGS The National Map, orthoimagery, refreshed June 2024.
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            aria-pressed={tilted}
            onClick={() => setTilted((v) => !v)}
            className="rounded-md border border-white/20 px-2 py-1 font-mono text-[0.65rem] text-white/80 hover:bg-white/10"
          >
            {tilted ? "Flat view" : "Tilt to 3D"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSeen(true);
              setRun((n) => n + 1);
            }}
            className="rounded-md border border-white/20 px-2 py-1 font-mono text-[0.65rem] text-white/80 hover:bg-white/10"
          >
            Replay the ice
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
