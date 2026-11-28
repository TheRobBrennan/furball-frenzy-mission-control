// The parade's music is real recordings in ordinary audio elements, which Safari and iPhones play most
// dependably. The drum major's whistle, the crowd cheer, and Little Bear's giggle are made on the spot.
import { paradeAudio, paradeScenes, type ParadeScene, type ParadeTrack } from "@/lib/parade/script";

/** How long one song takes to give way to the next, in seconds. */
export const CROSSFADE_S = 1.8;
const STOP_S = 0.4;
const STEP_MS = 60;

let ctx: AudioContext | null = null;
let current: ParadeTrack | null = null;
const players = new Map<ParadeTrack, HTMLAudioElement>();
const fades = new Map<HTMLAudioElement, number>();

function context(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  ctx ??= new window.AudioContext();
  // Safari also parks a context as "interrupted", after sleep or another app's audio.
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

function player(track: ParadeTrack) {
  let audio = players.get(track);
  if (!audio) {
    audio = new Audio(paradeAudio(track));
    audio.loop = true;
    audio.preload = "auto";
    players.set(track, audio);
  }
  return audio;
}

/** Moves the volume to a target a step at a time. An iPhone ignores volume, so there the song just changes. */
function fade(audio: HTMLAudioElement, to: number, seconds: number, done?: () => void) {
  window.clearInterval(fades.get(audio));
  const from = audio.volume;
  const steps = Math.max(1, Math.round((seconds * 1000) / STEP_MS));
  let step = 0;
  const timer = window.setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, from + ((to - from) * step) / steps));
    if (step >= steps) {
      window.clearInterval(timer);
      done?.();
    }
  }, STEP_MS);
  fades.set(audio, timer);
}

/** Told when the browser refuses to play, so the page can offer a button that is a fresh tap. */
let blocked: () => void = () => {};
export function onParadeSoundBlocked(listener: () => void) {
  blocked = listener;
}

/**
 * Call from a click, after starting the first song. Safari only lets an audio element play later if the
 * visitor's own tap played it once, so the other songs are started and stopped in the same moment.
 */
export function primeParadeSound() {
  try {
    context();
    for (const track of new Set(paradeScenes.map((s) => s.track))) {
      if (track === current) continue;
      const audio = player(track);
      void audio.play()?.catch(() => {});
      audio.pause();
    }
  } catch {
    // Quiet is fine.
  }
}

function tone(c: AudioContext, at: number, from: number, to: number, length: number, type: OscillatorType, gain: number) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(amp).connect(c.destination);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

/** A short crowd cheer on top of the music, for a tap on the picture. */
export function playCheer() {
  try {
    const c = context();
    if (!c) return;
    const now = c.currentTime;
    const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * 1.2), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1100;
    filter.Q.value = 0.7;
    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(0.2, now + 0.5);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    src.connect(filter).connect(amp).connect(c.destination);
    src.start(now);
    tone(c, now + 0.1, 900, 1500, 0.35, "sine", 0.08);
  } catch {
    // Quiet is fine.
  }
}

/** Fades the band out, quickly for pause or sound off, slowly when the next song is coming in. */
export function stopParadeSound(seconds = STOP_S) {
  if (!current) return;
  const audio = player(current);
  current = null;
  fade(audio, 0, seconds, () => audio.pause());
}

function startTrack(track: ParadeTrack) {
  const crossfade = current !== null;
  stopParadeSound(CROSSFADE_S);
  current = track;
  const audio = player(track);
  audio.currentTime = 0;
  audio.volume = 0;
  fade(audio, 1, crossfade ? CROSSFADE_S : STOP_S);
  void audio.play()?.catch((error: unknown) => {
    // Quiet is fine, the parade still plays. Forget this song so the next try starts it again.
    if (current !== track) return;
    current = null;
    if ((error as Error)?.name === "NotAllowedError") blocked();
  });
}

/** Plays what this scene sounds like. A scene on the same track lets the band play on. */
export function playParadeSound(scene: Pick<ParadeScene, "track" | "giggle">) {
  try {
    const changed = current !== scene.track;
    if (changed) startTrack(scene.track);
    const c = context();
    if (!c) return;
    if (changed) for (const [at, length] of [[0, 0.12], [0.18, 0.3]]) tone(c, c.currentTime + at, 2300, 2500, length, "square", 0.03);
    if (scene.giggle) for (let i = 0; i < 7; i++) tone(c, c.currentTime + 3 + i * 0.13, 520 + (i % 2) * 140, 700 + (i % 2) * 120, 0.09, "triangle", 0.16);
  } catch {
    // Quiet is fine, the parade still plays.
  }
}
