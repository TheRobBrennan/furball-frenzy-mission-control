"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { paradeFunnel } from "@/lib/analytics";
import { saveSoundEnabled, soundEnabled, subscribeToSound } from "@/lib/soundPreference";
import SoundSwitch from "@/components/SoundSwitch";
import { reducedMotion } from "@/lib/motion";
import { CURTAIN_MS, nextScene, paradeImage, paradeScenes, previousScene } from "@/lib/parade/script";
import PresentedBy from "./PresentedBy";
import TapFireworks from "./TapFireworks";
import { onParadeSoundBlocked, playCheer, playParadeSound, primeParadeSound, stopParadeSound } from "./paradeSound";

/** A symbol on a phone, the word from a small tablet up. */
function Label({ symbol, word }: { symbol: string; word: string }) {
  return (
    <>
      <span aria-hidden="true" className="text-lg sm:hidden">
        {symbol}
      </span>
      <span className="sr-only sm:not-sr-only">{word}</span>
    </>
  );
}

const button =
  "inline-flex min-h-12 min-w-11 shrink-0 items-center justify-center rounded-full border border-white/30 px-2 sm:px-4 font-bold text-white transition hover:bg-white/10 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const primary =
  "inline-flex min-h-12 whitespace-nowrap items-center justify-center rounded-full bg-amber px-4 sm:px-6 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const never = () => () => {};

const balloons = [
  { left: 6, delay: 0.2 },
  { left: 86, delay: 1.4 },
  { left: 14, delay: 2.6 },
  { left: 78, delay: 3.4 },
];

const confetti = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 53) % 40) / 10,
  time: 4 + ((i * 29) % 30) / 10,
  color: ["#fbbf24", "#f472b6", "#38bdf8", "#34d399", "#f87171"][i % 5],
}));

export default function ParadeShow() {
  const [index, setIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  // One choice for the site, so the gear menu and the switch under the picture always agree.
  const soundOn = useSyncExternalStore(subscribeToSound, soundEnabled, () => true);
  const still = useSyncExternalStore(never, reducedMotion, () => false);
  const scene = index === null ? null : paradeScenes[index];
  const last = index === paradeScenes.length - 1;

  const funnel = useRef<ReturnType<typeof paradeFunnel> | null>(null);
  const track: ReturnType<typeof paradeFunnel> = (stage) => (funnel.current ??= paradeFunnel())(stage);
  const skipped = useRef(false);
  useEffect(() => {
    if (index === null) return;
    const shown = paradeScenes[index];
    const send = (funnel.current ??= paradeFunnel());
    send({ event: "parade_scene_viewed", scene: shown.id, title: shown.title, position: index + 1, total: paradeScenes.length });
    if (index === paradeScenes.length - 1) send({ event: "parade_finished", playback: skipped.current ? "skipped" : "watched" });
  }, [index]);

  // The closing curtain rises a little after the last scene arrives, or at once with less motion.
  const [curtain, setCurtain] = useState(false);
  useEffect(() => {
    if (!last) return;
    const timer = window.setTimeout(() => setCurtain(true), still ? 0 : CURTAIN_MS);
    return () => {
      window.clearTimeout(timer);
      setCurtain(false);
    };
  }, [last, still]);
  const watchAgain = () => {
    skipped.current = false;
    track({ event: "parade_replayed" });
    setPaused(false);
    setIndex(0);
  };

  const [needsTap, setNeedsTap] = useState(false);
  useEffect(() => onParadeSoundBlocked(() => setNeedsTap(true)), []);

  // With less motion asked for, the visitor turns the pages. Otherwise the parade marches on by itself.
  useEffect(() => {
    if (index === null || paused || still || last) return;
    const timer = window.setTimeout(() => setIndex(nextScene(index)), paradeScenes[index].ms);
    return () => window.clearTimeout(timer);
  }, [index, paused, still, last]);

  // The music plays on between scenes, and stops for pause, sound off, or leaving the page.
  useEffect(() => {
    if (!scene) return;
    if (soundOn && !paused) playParadeSound(scene);
    else stopParadeSound();
  }, [scene, soundOn, paused]);
  useEffect(() => () => stopParadeSound(), []);

  const toggleSound = () => {
    if (!soundOn && scene) {
      playParadeSound(scene);
      primeParadeSound();
    }
    setNeedsTap(false);
    track({ event: "parade_sound_changed", sound: soundOn ? "off" : "on" });
    saveSoundEnabled(!soundOn);
  };

  const cheer = () => {
    if (!scene) return;
    if (soundOn) playCheer();
    track({ event: "parade_cheered", scene: scene.id });
  };

  const sponsor = (name: "sploosh" | "hockey") => track({ event: "parade_sponsor_opened", sponsor: name });

  if (index === null || !scene) {
    // A roped-off street and no balloons, so every one is a surprise.
    return (
      <section aria-label="Parade Day" className="relative isolate flex min-h-[34rem] flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-white/15 px-4 py-6 text-center">
        {!still && <TapFireworks onTap={() => { if (soundOn) playCheer(); track({ event: "parade_cheered", scene: "title" }); }} />}
        <Image src="/images/parade/street.jpg" alt="A city street roped off with barriers, crowds waiting for the parade" fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="-z-10 object-cover" />
        <div className="w-full max-w-md rounded-3xl bg-white/95 px-4 py-3 shadow-2xl">
          <PresentedBy onOpen={sponsor} />
        </div>
        <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-space/85 px-5 py-5 backdrop-blur">
          <p className="text-balance font-mono text-xs uppercase tracking-[0.2em] text-amber">The first parade in Furball Frenzy history</p>
          <p className="text-balance text-2xl font-black text-white sm:text-3xl">Listen, you can hear the drums.</p>
          <button type="button" data-testid="parade-start" onClick={() => { if (soundOn) playParadeSound(paradeScenes[0]); primeParadeSound(); track({ event: "parade_started" }); setIndex(0); }} className={`${primary} w-full sm:w-auto`}>
            Start the parade
          </button>
        </div>
      </section>
    );
  }

  const move = !still && !paused;
  return (
    <section aria-label="Parade Day" data-testid="parade-show" data-scene={scene.id} className="space-y-4">
      {!still && <TapFireworks onTap={cheer} />}
      <div className="relative h-[60svh] min-h-80 overflow-hidden rounded-3xl border border-white/15 bg-space-2">
        <div key={scene.id} className={`absolute inset-0 ${still ? "" : "parade-enter"}`}>
          <div className={`absolute inset-0 ${still ? "" : "parade-float"}`} style={{ animationPlayState: move ? "running" : "paused" }}>
            <Image src={paradeImage(scene)} alt={scene.alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-contain" />
          </div>
        </div>
        {!still &&
          confetti.map((c, i) => (
            <span key={i} aria-hidden="true" className="parade-confetti" style={{ left: `${c.left}%`, background: c.color, animationDelay: `${c.delay}s`, animationDuration: `${c.time}s`, animationPlayState: move ? "running" : "paused" }} />
          ))}
        {!still &&
          balloons.map((b, i) => (
            <span key={`${scene.id}-${i}`} aria-hidden="true" className="parade-balloon" style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationPlayState: move ? "running" : "paused" }}>
              🎈
            </span>
          ))}
        <button type="button" data-cheer onClick={still ? cheer : undefined} aria-label="Cheer for the parade" className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-amber" />
        {curtain && (
          <div data-testid="parade-curtain" className={`absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 bg-gradient-to-t from-space via-space/90 to-transparent px-4 pb-5 pt-10 text-center ${still ? "" : "parade-enter"}`}>
            <p aria-hidden="true" className="text-3xl">
              <span className="parade-invite-icon">🎈</span> 🥁 🎺 <span className="parade-invite-icon">🎈</span>
            </p>
            <p className="text-balance text-2xl font-black text-white sm:text-4xl">That&apos;s a wrap! Thanks for coming to the parade.</p>
            <p className="text-sm text-white/80">The elephants are still waving.</p>
            <button type="button" data-testid="parade-encore" data-no-fireworks onClick={watchAgain} className="inline-flex min-h-16 w-full max-w-sm items-center justify-center rounded-full bg-amber px-8 text-xl font-black text-space shadow-xl shadow-amber/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Watch again
            </button>
          </div>
        )}
      </div>
      {/* The scene on the left, the presenters flush right on the same row. On a phone they stack. */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div aria-live="polite" className="min-w-0 md:flex-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Scene {index + 1} of {paradeScenes.length}
          </p>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{scene.title}</h2>
          <p className="mt-1 min-h-12 text-lg text-white/85">{scene.caption}</p>
          <p className="text-sm text-white/65">Tap anywhere to cheer.</p>
        </div>
        <div className="w-full max-w-xs shrink-0 self-center rounded-2xl bg-white px-5 py-2 shadow-lg shadow-black/30 md:w-auto md:self-start">
          <PresentedBy compact onOpen={sponsor} />
        </div>
      </div>
      {needsTap && soundOn && (
        <button type="button" data-no-fireworks className={`${primary} w-full sm:w-auto`} onClick={() => { setNeedsTap(false); playParadeSound(scene); primeParadeSound(); }}>
          Your browser paused the music. Tap for sound
        </button>
      )}
      <div data-testid="parade-controls" className="flex flex-nowrap items-center justify-between gap-1 sm:flex-wrap sm:justify-start sm:gap-3">
        <button type="button" className={button} onClick={() => setIndex(previousScene(index))} disabled={index === 0}>
          <Label symbol="‹" word="Back" />
        </button>
        {last ? (
          <button type="button" className={primary} onClick={watchAgain}>
            Watch again
          </button>
        ) : (
          <button type="button" className={primary} onClick={() => setIndex(nextScene(index))}>
            Next
          </button>
        )}
        {!still && !last && (
          <button type="button" className={button} onClick={() => setPaused(!paused)}>
            <Label symbol={paused ? "▶" : "❚❚"} word={paused ? "Play" : "Pause"} />
          </button>
        )}
        <SoundSwitch compact on={soundOn} onToggle={toggleSound} className="min-h-12 shrink-0 justify-center rounded-full border border-white/30 px-1.5 text-white hover:bg-white/10 sm:px-4" />
        {!last && (
          <button type="button" className={button} onClick={() => { skipped.current = true; setIndex(paradeScenes.length - 1); }}>
            <Label symbol="⏭" word="Skip to the end" />
          </button>
        )}
      </div>
      <p className="text-xs text-white/55">
        Music: the U.S. Marine Band, the U.S. Navy Fleet Forces Band, and a public domain drum cadence. &ldquo;Also sprach Zarathustra&rdquo; performed by Kevin MacLeod,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Also_Sprach_Zarathustra_-_Einleitung.ogg" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">source</a>, trimmed,{" "}
        <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">CC BY 3.0</a>. No endorsement implied.
      </p>
    </section>
  );
}
