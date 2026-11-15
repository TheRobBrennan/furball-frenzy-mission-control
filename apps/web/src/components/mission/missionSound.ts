// The mission sounds, all made on the spot like the Enhance sound, so no audio file ships: a flat voice
// counting down three, two, one, liftoff with a beep for each number, a rumble as the rocket leaves, a low space and room ambience, radio
// static and a blip when the crew talk over comms, and a chime or a low buzz when a scene goes well or
// not. They only start from the Launch click, they stay quiet, and the visitor can turn them off.
let ctx: AudioContext | null = null;
let enabled = true;
let stopAmbienceNow: (() => void) | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, start: number, from: number, to: number, length: number, type: OscillatorType, gain: number) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + length);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(amp).connect(c.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** A short burst of filtered noise, the hiss of a radio. */
function burst(c: AudioContext, start: number, length: number, freq: number, q: number, gain: number) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, length + 0.05);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const amp = c.createGain();
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  src.connect(filter).connect(amp).connect(c.destination);
  src.start(start);
  src.stop(start + length + 0.05);
}

// A flat computer voice for the countdown, if the browser has one. The beeps carry it without a voice.
function speak(word: string, volume = 0.6) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const say = new SpeechSynthesisUtterance(word);
  say.rate = 0.85;
  say.pitch = 0.5;
  say.volume = volume;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(say);
}

const attempt = (fn: () => void) => {
  if (!enabled) return;
  try {
    fn();
  } catch {
    // Quiet is fine, the story still plays.
  }
};

/** Turns every mission sound on or off. Turning them off also stops the ambience and the voice. */
export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    stopAmbience();
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Nothing to cancel.
    }
  }
}

/** Call from the Launch click, so the browser lets the sounds play later in the story. */
export function primeMissionSound() {
  try {
    context();
  } catch {
    // Quiet is fine.
  }
}

/** The voice and the beep for one number of the countdown. */
export function playCountdown(text: string) {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    const lift = text === "LIFTOFF";
    const splash = text === "SPLASH";
    if (lift) tone(c, t, 440, 1760, 0.5, "square", 0.03);
    else if (splash) tone(c, t, 1200, 400, 0.4, "triangle", 0.04);
    else tone(c, t, 880, 880, 0.12, "square", 0.03);
    speak(lift ? "Liftoff!" : splash ? "Splashdown!" : text === "3" ? "Three" : text === "2" ? "Two" : "One", lift || splash ? 0.8 : 0.6);
  });
}

/** The no-go buzzer, then a low, frustrated grumble. */
export function playNoGo() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    tone(c, t, 150, 150, 0.35, "sawtooth", 0.05);
    tone(c, t + 0.45, 200, 110, 0.5, "sawtooth", 0.04);
    tone(c, t + 0.5, 190, 100, 0.5, "triangle", 0.03);
  });
}

/** A frustrated grunt, a ratcheting wrench, and a few clanks of metal while the fix is made. */
export function playWrench() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    tone(c, t, 220, 120, 0.3, "sawtooth", 0.04);
    for (let i = 0; i < 6; i++) {
      burst(c, t + 0.4 + i * 0.16, 0.05, 3500, 3, 0.06);
      tone(c, t + 0.4 + i * 0.16, 900 + (i % 2) * 300, 700, 0.07, "square", 0.02);
    }
    tone(c, t + 1.5, 1400, 1000, 0.15, "triangle", 0.05);
    tone(c, t + 1.7, 520, 520, 0.15, "square", 0.03);
  });
}

/** The fix works: a happy rising arpeggio. */
export function playFixed() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    [523, 659, 784, 1047].forEach((f, i) => tone(c, t + i * 0.1, f, f, 0.16, "triangle", 0.05));
  });
}

/** The red alert: a two-tone siren, three times. */
export function playAlarm() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    for (let i = 0; i < 3; i++) {
      tone(c, t + i * 0.6, 660, 660, 0.28, "square", 0.04);
      tone(c, t + i * 0.6 + 0.3, 440, 440, 0.28, "square", 0.04);
    }
  });
}

/** Piggy's sad moment: a slow, falling, minor melody and a little sniffle. */
export function playSad() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    [392, 349, 311, 261].forEach((f, i) => tone(c, t + i * 0.45, f, f * 0.98, 0.5, "sine", 0.05));
    burst(c, t + 2.0, 0.12, 2500, 1.5, 0.04);
    burst(c, t + 2.25, 0.1, 2800, 1.5, 0.04);
  });
}

export function playLiftoff() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    tone(c, t, 50, 220, 1.8, "sawtooth", 0.05);
    tone(c, t, 90, 440, 1.8, "triangle", 0.02);
    burst(c, t, 1.8, 300, 0.7, 0.05);
  });
}

/** A line over comms: a click, a puff of static, and a short roger beep. */
export function playComms() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    burst(c, t, 0.14, 2200, 1.2, 0.05);
    tone(c, t + 0.14, 1500, 1500, 0.06, "sine", 0.04);
    tone(c, t + 0.22, 1100, 1100, 0.06, "sine", 0.04);
  });
}

/** The splash: a hiss of water and a short falling tone as the capsule lands in the ocean. */
export function playSplash() {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    burst(c, t, 1.1, 700, 0.5, 0.07);
    tone(c, t, 320, 70, 0.5, "sine", 0.05);
  });
}

export function playPhase(ok: boolean) {
  attempt(() => {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    if (ok) {
      tone(c, t, 660, 660, 0.1, "sine", 0.05);
      tone(c, t + 0.1, 990, 990, 0.18, "sine", 0.05);
    } else {
      tone(c, t, 180, 90, 0.45, "sawtooth", 0.05);
    }
  });
}

export type AmbienceKind = "room" | "space";

export function stopAmbience() {
  stopAmbienceNow?.();
  stopAmbienceNow = null;
}

/**
 * A quiet bed of sound under a scene. A room hums and now and then crackles with radio static, space is a
 * low, slow drone. Starting a new one stops the old one.
 */
export function startAmbience(kind: AmbienceKind) {
  stopAmbience();
  attempt(() => {
    const c = context();
    if (!c) return;
    const master = c.createGain();
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.exponentialRampToValueAtTime(kind === "space" ? 0.05 : 0.035, c.currentTime + 1.2);
    master.connect(c.destination);
    const oscs: OscillatorNode[] = [];
    const add = (freq: number, type: OscillatorType, gain: number) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g).connect(master);
      o.start();
      oscs.push(o);
    };
    if (kind === "space") {
      add(55, "sine", 1);
      add(82.5, "sine", 0.6);
      add(110.4, "triangle", 0.25);
    } else {
      add(60, "sine", 1);
      add(180, "sine", 0.3);
    }
    // A slow swell, so the bed breathes.
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = kind === "space" ? 0.12 : 0.3;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();
    oscs.push(lfo);
    const crackle = kind === "room" ? window.setInterval(() => attempt(() => burst(c, c.currentTime + 0.01, 0.08 + Math.random() * 0.1, 1800 + Math.random() * 1500, 1.5, 0.012)), 2600) : undefined;
    stopAmbienceNow = () => {
      if (crackle) window.clearInterval(crackle);
      try {
        master.gain.cancelScheduledValues(c.currentTime);
        master.gain.setValueAtTime(master.gain.value, c.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
        oscs.forEach((o) => o.stop(c.currentTime + 0.45));
      } catch {
        // Already stopped.
      }
    };
  });
}
