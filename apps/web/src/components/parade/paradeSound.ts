// The parade's music is real recordings, played through Web Audio so one tap unlocks them on a phone.
// The drum major's whistle, the crowd cheer, and Little Bear's giggle are made on the spot.
import { paradeAudio, type ParadeScene, type ParadeTrack } from "@/lib/parade/script";

/** How long one song takes to give way to the next, in seconds. */
export const CROSSFADE_S = 1.8;
const STOP_S = 0.4;

let ctx: AudioContext | null = null;
let music: { track: ParadeTrack; stop: (seconds: number) => void } | null = null;
const files = new Map<ParadeTrack, Promise<AudioBuffer>>();

function context(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  ctx ??= new window.AudioContext();
  // Safari also parks a context as "interrupted", after sleep or another app's audio.
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

/** Call from the Start click, so a phone lets the music play when later scenes arrive. */
export function primeParadeSound() {
  try {
    const c = context();
    if (!c) return;
    // Safari is surest to unlock when something actually plays during the tap, so play a moment of silence.
    const silence = c.createBufferSource();
    silence.buffer = c.createBuffer(1, 1, c.sampleRate);
    silence.connect(c.destination);
    silence.start();
  } catch {
    // Quiet is fine.
  }
}

function load(c: AudioContext, track: ParadeTrack) {
  let file = files.get(track);
  if (!file) {
    file = fetch(paradeAudio(track)).then((r) => r.arrayBuffer()).then((data) => c.decodeAudioData(data));
    // A failed download is tried again next time.
    file.catch(() => files.delete(track));
    files.set(track, file);
  }
  return file;
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
  music?.stop(seconds);
  music = null;
}

function startTrack(c: AudioContext, track: ParadeTrack) {
  const crossfade = music !== null;
  stopParadeSound(CROSSFADE_S);
  const src = c.createBufferSource();
  const amp = c.createGain();
  let stopped = false;
  let started = false;
  src.connect(amp).connect(c.destination);
  music = {
    track,
    stop: (seconds) => {
      stopped = true;
      if (!started) return amp.disconnect();
      const now = c.currentTime;
      amp.gain.cancelScheduledValues(now);
      amp.gain.setValueAtTime(amp.gain.value, now);
      amp.gain.linearRampToValueAtTime(0, now + seconds);
      src.stop(now + seconds);
    },
  };
  load(c, track)
    .then((buffer) => {
      if (stopped) return;
      src.buffer = buffer;
      src.loop = true;
      amp.gain.setValueAtTime(0, c.currentTime);
      amp.gain.linearRampToValueAtTime(1, c.currentTime + (crossfade ? CROSSFADE_S : STOP_S));
      src.start();
      started = true;
    })
    .catch(() => {
      // Quiet is fine, the parade still plays. Forget this song so the next scene tries it again.
      if (music?.track === track) music = null;
    });
}

/** Plays what this scene sounds like. A scene on the same track lets the band play on. */
export function playParadeSound(scene: Pick<ParadeScene, "track" | "giggle">) {
  try {
    const c = context();
    if (!c) return;
    if (music?.track !== scene.track) {
      for (const [at, length] of [[0, 0.12], [0.18, 0.3]]) tone(c, c.currentTime + at, 2300, 2500, length, "square", 0.03);
      startTrack(c, scene.track);
    }
    if (scene.giggle) for (let i = 0; i < 7; i++) tone(c, c.currentTime + 3 + i * 0.13, 520 + (i % 2) * 140, 700 + (i % 2) * 120, 0.09, "triangle", 0.16);
  } catch {
    // Quiet is fine, the parade still plays.
  }
}
