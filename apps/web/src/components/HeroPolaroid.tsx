"use client";

import Image, { getImageProps } from "next/image";
import ExtLink from "@/components/ExtLink";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
  // A caption that links out, with a note on who presented it.
  link?: { prefix: string; href: string; text: string; note: ReactNode };
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
    caption: "Just arrived in Seattle, the elephants at the React Native Seattle Meetup, sharing their expertise over a delicious beverage",
    link: {
      prefix: "Just arrived in Seattle, the elephants at the ",
      href: "https://ti.to/swm/react-native-seattle-meetup",
      text: "React Native Seattle Meetup",
      note: (
        <>
          , presented by <ExtLink href="https://swmansion.com/" onLight>Software Mansion</ExtLink>, sharing their expertise over a delicious beverage
        </>
      ),
    },
    width: 1200,
    height: 1600,
    tilt: -2,
    position: "50% 72%",
  },
  {
    src: "/images/developer-on-an-apple-ii.jpg",
    alt: "The developer of this game as a toddler in a white undershirt, sitting at an Apple ][ computer with a small TV monitor on top",
    caption: "Where it began: the developer, a little 'un, at an Apple ][ in Iowa",
    width: 974,
    height: 1009,
    tilt: -2,
    position: "30% 50%",
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
const SWAP_EVERY_MS = 10000;
// The caption waits for the photo's own reveal to finish, this is only the fallback if that never fires.
const CAPTION_FALLBACK_MS = 6200;
const DEVELOP_MS = 5000;

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
  // The caption follows the photo: it fades out when a new photo starts to arrive and fades in once
  // that photo has been drawn in, so a caption never names a photo that is not on screen yet.
  const [captionIdx, setCaptionIdx] = useState(0);
  const [captionHidden, setCaptionHidden] = useState(false);

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

  // A photo is fetched the way the page itself will ask for it, same srcset and sizes, so it is already
  // in the cache when it is shown. The transition never starts on a photo that is not ready, which is
  // what used to leave the old photo on screen while the new caption appeared.
  const loaded = useRef<Set<number>>(new Set());
  const preload = useCallback((index: number) => {
    if (loaded.current.has(index)) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const slideToLoad = slides[index];
      const { props } = getImageProps({ src: slideToLoad.src, alt: "", width: slideToLoad.width, height: slideToLoad.height, sizes: SIZES });
      const img = new window.Image();
      img.sizes = props.sizes ?? "";
      if (props.srcSet) img.srcset = props.srcSet;
      img.src = String(props.src);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        loaded.current.add(index);
        resolve();
      };
      if (typeof img.decode === "function") img.decode().then(finish, finish);
      else {
        img.onload = finish;
        img.onerror = finish;
      }
      window.setTimeout(finish, 4000);
    });
  }, []);

  const advancing = useRef(false);
  const advance = useCallback(async () => {
    if (advancing.current) return;
    advancing.current = true;
    const from = posRef.current;
    const to = (from + 1) % order.length;
    await preload(order[to]);
    posRef.current = to;
    showLeaving(order[from]);
    setPos(to);
    advancing.current = false;
  }, [order, showLeaving, preload]);

  // Keep the photo after the next one warm too.
  useEffect(() => {
    void preload(order[(pos + 1) % order.length]);
  }, [order, pos, preload]);

  // One place decides when the caption changes: the caption names the photo on screen, so it lets go of the
  // old name as soon as a new photo starts to arrive and takes the new name when that photo has finished
  // drawing in. The reveal animation ending is the signal, the timer is only a safety net.
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);
  const settleCaption = useCallback((index: number) => {
    // A reveal that ends after the visitor has already moved on must not rename the photo on screen.
    if (index !== currentRef.current) return;
    setCaptionIdx(index);
    setCaptionHidden(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaptionHidden((hidden) => (current === captionIdx ? hidden : true));
    if (current === captionIdx) return;
    const id = window.setTimeout(() => settleCaption(current), reduced ? 0 : CAPTION_FALLBACK_MS);
    return () => window.clearTimeout(id);
    // the caption only needs to react to the photo changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, reduced]);

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
  const captionSlide = slides[captionIdx];
  const layers = leaving !== null && leaving !== current ? [leaving, current] : [current];

  return (
    <figure
      className="polaroid order-1 mx-auto w-full max-w-[19rem] rounded-md bg-white p-3 pb-4 shadow-2xl shadow-black/60 sm:max-w-sm lg:order-2 lg:max-w-md"
      style={{ ["--tilt" as string]: "0deg" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          {/* Edges of the photo, dark pencil lines on white paper. */}
          <filter id="tom-pencil" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" bias="0" preserveAlpha="true" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="-6" intercept="1" />
              <feFuncG type="linear" slope="-6" intercept="1" />
              <feFuncB type="linear" slope="-6" intercept="1" />
            </feComponentTransfer>
          </filter>
          {/* A rippling edge for the sweep, the photo wavers until it settles. */}
          <filter id="tom-wobble" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <button
        type="button"
        onClick={advance}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label={`Show another photo of the crew. Now showing: ${captionSlide.caption}`}
        className="block w-full cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
      >
        <span
          className="hero-photo relative block aspect-square w-full overflow-hidden rounded-sm bg-space-2"
          style={{ ["--photo-tilt" as string]: `${slide.tilt}deg` }}
        >
          {layers.map((index) => {
            const s = slides[index];
            const isNew = index === current && layers.length === 2;
            const image = (extra: string, alt: string) => (
              <Image
                src={s.src}
                alt={alt}
                width={s.width}
                height={s.height}
                priority={index === 0}
                sizes={SIZES}
                style={{ objectPosition: s.position }}
                className={`absolute inset-0 h-full w-full object-cover ${extra}`}
              />
            );
            if (!isNew) return <span key={s.src}>{image("", index === current ? s.alt : "")}</span>;
            // The new photo arrives like the a-ha "Take On Me" video: first a pencil sketch of
            // it, then the real photo sweeps in across the drawing along a wobbly edge.
            return (
              <span key={s.src} className="absolute inset-0 block">
                {image("tom-sketch", "")}
                <span
                  className="tom-color absolute inset-0 block"
                  onAnimationEnd={(event) => {
                    if (event.animationName === "tom-reveal") settleCaption(index);
                  }}
                >
                  {image("", s.alt)}
                </span>
              </span>
            );
          })}
        </span>
      </button>
      {/* The figcaption fades out and in. The span inside plays the arrival animation, and an animation would
          override the fade if they were the same element, which is what kept the old caption on screen. */}
      <figcaption
        className={`mt-3 block min-h-[3.5em] text-center font-mono text-xs font-semibold text-space transition-opacity duration-300 sm:text-sm ${
          captionHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        <span key={captionSlide.caption} className="photo-caption block">
          {captionSlide.link ? (
            <>
              {captionSlide.link.prefix}
              <ExtLink href={captionSlide.link.href} onLight>
                {captionSlide.link.text}
              </ExtLink>
              {captionSlide.link.note}
            </>
          ) : (
            captionSlide.caption
          )}
        </span>
      </figcaption>
    </figure>
  );
}
