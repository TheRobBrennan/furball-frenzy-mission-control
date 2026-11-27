// The parade sounds, made on the spot like the mission sounds, so no audio file ships and no music is
// borrowed: a drum cadence, a brass fanfare, a crowd cheer, a radio blip, and Little Bear's giggle.
import type { ParadeSound } from "@/lib/parade/script";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  ctx ??= new window.AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, out: AudioNode, at: number, from: number, to: number, length: number, type: OscillatorType, gain: number) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(amp).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

function noise(c: AudioContext, out: AudioNode, at: number, length: number, freq: number, q: number, gain: number, swell = false) {
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * length), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const amp = c.createGain();
  amp.gain.setValueAtTime(swell ? 0.0001 : gain, at);
  if (swell) amp.gain.exponentialRampToValueAtTime(gain, at + length * 0.4);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(filter).connect(amp).connect(out);
  src.start(at);
}

const sounds: Record<ParadeSound, (c: AudioContext, out: AudioNode, now: number) => void> = {
  drums(c, out, now) {
    for (let beat = 0; beat < 16; beat++) {
      const at = now + beat * 0.25;
      if (beat % 4 === 0) tone(c, out, at, 110, 55, 0.18, "sine", 0.3);
      else noise(c, out, at, 0.09, 2400, 0.8, beat % 2 ? 0.1 : 0.16);
    }
  },
  fanfare(c, out, now) {
    const notes: [number, number, number][] = [[392, 0, 0.18], [392, 0.2, 0.18], [523, 0.4, 0.35], [659, 0.8, 0.35], [784, 1.2, 0.9]];
    for (const [freq, at, length] of notes) {
      tone(c, out, now + at, freq, freq, length, "sawtooth", 0.07);
      tone(c, out, now + at, freq / 2, freq / 2, length, "square", 0.035);
    }
  },
  cheer(c, out, now) {
    noise(c, out, now, 2.4, 900, 0.6, 0.18, true);
    noise(c, out, now + 0.3, 1.8, 1800, 0.9, 0.08, true);
  },
  radio(c, out, now) {
    noise(c, out, now, 0.25, 1500, 4, 0.12);
    for (const [at, freq] of [[0.3, 880], [0.5, 1320], [0.7, 1100]]) tone(c, out, now + at, freq, freq, 0.12, "sine", 0.12);
    sounds.drums(c, out, now + 1);
  },
  giggle(c, out, now) {
    for (let i = 0; i < 7; i++) tone(c, out, now + 0.4 + i * 0.13, 520 + (i % 2) * 140, 700 + (i % 2) * 120, 0.09, "triangle", 0.14);
    sounds.cheer(c, out, now + 1.6);
  },
};

/** Stops whatever the last scene was playing. */
export function stopParadeSound() {
  master?.disconnect();
  master = null;
}

export function playParadeSound(sound: ParadeSound) {
  stopParadeSound();
  try {
    const c = context();
    if (!c) return;
    master = c.createGain();
    master.connect(c.destination);
    sounds[sound](c, master, c.currentTime + 0.05);
  } catch {
    // Quiet is fine, the parade still plays.
  }
}
