"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { paradeFunnel } from "@/lib/analytics";
import { readSound, SOUND_KEY } from "@/lib/mission";
import { reducedMotion } from "@/lib/motion";
import { nextScene, paradeImage, paradeScenes, previousScene } from "@/lib/parade/script";
import { playParadeSound, stopParadeSound } from "./paradeSound";

const button =
  "inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-white/30 px-4 font-bold text-white transition hover:bg-white/10 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const primary =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-amber px-6 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// Sound follows the same saved choice as the mission.
const savedSound = () => {
  try {
    return readSound(window.localStorage.getItem(SOUND_KEY));
  } catch {
    return true;
  }
};
const never = () => () => {};

const confetti = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 53) % 40) / 10,
  time: 4 + ((i * 29) % 30) / 10,
  color: ["#fbbf24", "#f472b6", "#38bdf8", "#34d399", "#f87171"][i % 5],
}));

export default function ParadeShow() {
  const [index, setIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const saved = useSyncExternalStore(never, savedSound, () => true);
  const soundOn = choice ?? saved;
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

  // With less motion asked for, the visitor turns the pages. Otherwise the parade marches on by itself.
  useEffect(() => {
    if (index === null || paused || still || last) return;
    const timer = window.setTimeout(() => setIndex(nextScene(index)), paradeScenes[index].ms);
    return () => window.clearTimeout(timer);
  }, [index, paused, still, last]);

  useEffect(() => {
    if (!scene || !soundOn || paused) return;
    playParadeSound(scene.sound);
    return stopParadeSound;
  }, [scene, soundOn, paused]);

  const toggleSound = () => {
    setChoice(!soundOn);
    track({ event: "parade_sound_changed", sound: soundOn ? "off" : "on" });
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? "off" : "on");
    } catch {
      // The choice just is not remembered, that is fine.
    }
  };

  if (index === null || !scene) {
    const cover = paradeScenes[0];
    return (
      <section aria-label="Parade Day" className="space-y-4">
        <Image src={paradeImage(cover)} alt={cover.alt} width={cover.width} height={cover.height} priority sizes="(max-width: 1152px) 100vw, 1152px" className="h-auto w-full rounded-3xl border border-white/15" />
        <button type="button" data-testid="parade-start" onClick={() => { track({ event: "parade_started" }); setIndex(0); }} className={`${primary} w-full sm:w-auto`}>
          Start the parade
        </button>
      </section>
    );
  }

  const move = !still && !paused;
  return (
    <section aria-label="Parade Day" data-testid="parade-show" data-scene={scene.id} className="space-y-4">
      <div className="relative h-[60svh] min-h-80 overflow-hidden rounded-3xl border border-white/15 bg-space-2">
        <div key={scene.id} className={`absolute inset-0 ${still ? "" : "parade-float"}`} style={{ animationPlayState: move ? "running" : "paused" }}>
          <Image src={paradeImage(scene)} alt={scene.alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-contain" />
        </div>
        {!still &&
          confetti.map((c, i) => (
            <span key={i} aria-hidden="true" className="parade-confetti" style={{ left: `${c.left}%`, background: c.color, animationDelay: `${c.delay}s`, animationDuration: `${c.time}s`, animationPlayState: move ? "running" : "paused" }} />
          ))}
      </div>
      <div aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
          Scene {index + 1} of {paradeScenes.length}
        </p>
        <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{scene.title}</h2>
        <p className="mt-1 min-h-12 text-lg text-white/85">{scene.caption}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={button} onClick={() => setIndex(previousScene(index))} disabled={index === 0}>
          Back
        </button>
        {last ? (
          <button type="button" className={primary} onClick={() => { skipped.current = false; track({ event: "parade_replayed" }); setPaused(false); setIndex(0); }}>
            Watch again
          </button>
        ) : (
          <button type="button" className={primary} onClick={() => setIndex(nextScene(index))}>
            Next
          </button>
        )}
        {!still && !last && (
          <button type="button" className={button} onClick={() => setPaused(!paused)}>
            {paused ? "Play" : "Pause"}
          </button>
        )}
        <button type="button" className={button} onClick={toggleSound} aria-pressed={soundOn}>
          Sound {soundOn ? "on" : "off"}
        </button>
        {!last && (
          <button type="button" className={button} onClick={() => { skipped.current = true; setIndex(paradeScenes.length - 1); }}>
            Skip to the end
          </button>
        )}
      </div>
    </section>
  );
}
