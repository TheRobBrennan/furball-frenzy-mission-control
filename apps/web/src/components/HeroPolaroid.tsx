"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  tilt: number; // degrees
  position: string; // object-position for the square crop
};

// Every photo here is already on the public page, nothing new is published by the carousel.
const slides: Slide[] = [
  {
    src: "/images/american-space-program.jpg",
    alt: "An illustration of two Polish elephants and a pilot pig in an aviator cap under an American Space Program sign",
    caption: "Reporting for duty at the American Space Program",
    width: 1024,
    height: 1024,
    tilt: 2,
    position: "50% 50%",
  },
  {
    src: "/images/elephants-at-the-window.jpg",
    alt: "Two pigs and the two Polish elephants in white swm t-shirts at an airplane window",
    caption: "Cleared for takeoff",
    width: 1500,
    height: 2000,
    tilt: -3,
    position: "50% 55%",
  },
  {
    src: "/images/elephants-on-green.jpg",
    alt: "The two Polish elephants in white swm t-shirts sitting side by side on a green blanket",
    caption: "Suited up and ready",
    width: 1500,
    height: 2000,
    tilt: -1.5,
    position: "50% 45%",
  },
  {
    src: "/images/north-carolina-crew.jpg",
    alt: "The North Carolina crew, a blue bear, the elephants, a pig, and a little duck, gathered on a bed",
    caption: "The North Carolina crew, gathering before launch",
    width: 2000,
    height: 1500,
    tilt: 2.5,
    position: "22% 50%",
  },
  {
    src: "/images/elephants-at-the-meetup.jpg",
    alt: "One of the Polish elephants on a table next to a pint glass and two coins",
    caption: "A React Native meetup, with the coins",
    width: 1200,
    height: 1600,
    tilt: -2,
    position: "50% 72%",
  },
  {
    src: "/images/piggy-meets-hamley-1.jpg",
    alt: "Piggy, a big pink pig with large eyes, with Hamley, a small pink Steiff pig, tucked in front of him",
    caption: "Piggy meets Hamley for the first time",
    width: 1200,
    height: 1600,
    tilt: 1.5,
    position: "50% 50%",
  },
  {
    src: "/images/piggy-meets-hamley-2.jpg",
    alt: "Piggy and Hamley seen from behind on a windowsill, looking out over trees and a lake",
    caption: "Taking in the view together",
    width: 1200,
    height: 1600,
    tilt: -2.5,
    position: "50% 55%",
  },
  {
    src: "/images/piggy-meets-hamley-3.jpg",
    alt: "Hamley and Piggy side by side on a windowsill next to a houndstooth curtain",
    caption: "Window seats",
    width: 1200,
    height: 1600,
    tilt: 3,
    position: "50% 50%",
  },
];

const SIZES = "(min-width: 1024px) 448px, (min-width: 640px) 384px, 304px";
const SWAP_EVERY_MS = 7000;
const DEVELOP_MS = 1600;

function shuffled(): number[] {
  const order = slides.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// The hero polaroid. The server renders the first photo, so the page paints at once. After it loads
// the deck is shuffled, so each visit starts on a different photo, and a new photo "develops" in
// every few seconds like an instant print. Click or tap for the next one. It holds still while the
// pointer or keyboard focus is on it, and when the visitor prefers reduced motion.
export default function HeroPolaroid() {
  const [order, setOrder] = useState<number[]>(() => slides.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);

  const current = order[pos];

  const showLeaving = useCallback((index: number) => {
    setLeaving(index);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(null), DEVELOP_MS);
  }, []);

  // Shuffle once the page has loaded, then start on a random photo that develops in over the first
  // one. The initial render stays deterministic so the server and the browser agree.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    media.addEventListener("change", sync);
    sync();
    const timer = setTimeout(() => {
      const next = shuffled();
      showLeaving(0);
      posRef.current = 0;
      setPos(0);
      setOrder(next);
    }, 900);
    return () => {
      media.removeEventListener("change", sync);
      clearTimeout(timer);
    };
  }, [showLeaving]);

  const advance = useCallback(() => {
    const from = posRef.current;
    const to = (from + 1) % order.length;
    posRef.current = to;
    showLeaving(order[from]);
    setPos(to);
  }, [order, showLeaving]);

  // The next photo is fetched ahead of time so it can develop the moment it is shown.
  useEffect(() => {
    const next = slides[order[(pos + 1) % order.length]];
    const img = new window.Image();
    img.src = `/_next/image?url=${encodeURIComponent(next.src)}&w=640&q=75`;
  }, [order, pos]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      if (!document.hidden) advance();
    }, SWAP_EVERY_MS);
    return () => clearInterval(id);
  }, [reduced, paused, advance]);

  useEffect(() => {
    const timer = leaveTimer;
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const slide = slides[current];
  const layers = leaving !== null && leaving !== current ? [leaving, current] : [current];

  return (
    <figure
      className="polaroid order-1 mx-auto w-full max-w-[19rem] rounded-md bg-white p-3 pb-4 shadow-2xl shadow-black/60 sm:max-w-sm lg:order-2 lg:max-w-md"
      style={{ ["--tilt" as string]: "0deg" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={advance}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label={`Show another photo of the crew. Now showing: ${slide.caption}`}
        className="block w-full cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
      >
        <span
          className="hero-photo relative block aspect-square w-full overflow-hidden rounded-sm bg-space-2"
          style={{ ["--photo-tilt" as string]: `${slide.tilt}deg` }}
        >
          {layers.map((index) => {
            const s = slides[index];
            const isNew = index === current && layers.length === 2;
            return (
              <Image
                key={s.src}
                src={s.src}
                alt={index === current ? s.alt : ""}
                width={s.width}
                height={s.height}
                priority={index === 0}
                sizes={SIZES}
                style={{ objectPosition: s.position }}
                className={`absolute inset-0 h-full w-full object-cover ${isNew ? "photo-develop" : ""}`}
              />
            );
          })}
        </span>
        <span
          key={slide.caption}
          className="photo-caption mt-3 block min-h-[2.5em] text-center font-mono text-xs font-semibold text-space sm:text-sm"
        >
          {slide.caption}
        </span>
      </button>
    </figure>
  );
}
