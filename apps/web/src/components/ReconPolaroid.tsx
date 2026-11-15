"use client";

import Image from "next/image";
import { useState } from "react";
import { playEnhance, playZoomOut } from "./enhanceSound";

// A satellite recon polaroid in portrait, in a deep-sea sonar style. Enhance goes one step deeper each
// press, a tilt to 3D, then in, then further in, with a sound and a flash of ENHANCE. Zoom out resets.
export default function ReconPolaroid({
  src,
  alt,
  readout,
  caption,
  className = "",
  tilt = "-3deg",
  orientation = "portrait",
  info,
  zoom = [2.1, 3.7],
}: {
  src: string;
  alt: string;
  readout: string;
  caption: string;
  className?: string;
  tilt?: string;
  orientation?: "portrait" | "landscape";
  info?: string; // a tooltip over the image
  zoom?: [number, number]; // how far the last two Enhance steps go in
}) {
  const [level, setLevel] = useState(0);
  const [flash, setFlash] = useState(0);
  return (
    <figure
      className={`polaroid relative rounded-md bg-white p-2.5 pb-3 shadow-2xl shadow-black/60 ${className}`}
      style={{ ["--tilt" as string]: tilt }}
    >
      <div
        title={info}
        className={`relative overflow-hidden rounded-sm bg-[#001628] ${orientation === "portrait" ? "aspect-[3/4]" : "aspect-[3/2]"}`}
      >
        <div
          className={`recon-img absolute inset-0 ${["", "recon-tilt", "recon-zoom2", "recon-zoom3"][level]}`}
          style={{ ["--zoom2" as string]: zoom[0], ["--zoom3" as string]: zoom[1] }}
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 280px, 80vw" className="object-cover" />
        </div>
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
        <div aria-hidden="true" className="sonar absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
          <span className="sonar-ring" />
          <span className="sonar-ring sonar-ring-2" />
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9072b]" />
        </div>
        <div aria-hidden="true" className="absolute left-1.5 top-1.5 h-4 w-4 border-l-2 border-t-2 border-[#99d9d9]" />
        <div aria-hidden="true" className="absolute bottom-1.5 left-1.5 h-4 w-4 border-b-2 border-l-2 border-[#99d9d9]" />
        <div aria-hidden="true" className="absolute bottom-1.5 right-1.5 h-4 w-4 border-b-2 border-r-2 border-[#99d9d9]" />
        {flash > 0 && (
          <p
            key={flash}
            aria-hidden="true"
            className="enhance-flash pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-lg font-bold tracking-[0.3em] text-[#e9fbfb]"
          >
            ENHANCE.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            if (level >= 3) {
              playZoomOut();
              setLevel(0);
              setFlash(0);
            } else {
              playEnhance(level + 1);
              setLevel(level + 1);
              setFlash((n) => n + 1);
            }
          }}
          className="absolute right-1.5 top-1.5 z-10 rounded-md border border-[#99d9d9]/70 bg-[#001628]/80 px-2.5 py-1 font-mono text-[0.7rem] font-semibold text-[#e9fbfb] backdrop-blur-sm hover:bg-[#001628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9072b]"
        >
          {level >= 3 ? "Zoom out" : "Enhance"}
        </button>
        <p className="absolute bottom-2.5 left-0 right-0 text-center font-mono text-[0.58rem] uppercase tracking-wide text-[#e9fbfb]">
          {readout}
        </p>
      </div>
      <figcaption className="mt-2 text-center font-mono text-[0.65rem] font-semibold leading-snug text-space">{caption}</figcaption>
    </figure>
  );
}
