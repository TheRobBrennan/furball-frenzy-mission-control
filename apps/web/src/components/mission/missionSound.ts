// The launch sounds, made on the spot like the Enhance sound, so no audio file ships: a tick for each
// count, a rising rumble at liftoff, and a chime or a low buzz as each phase succeeds or fails. They
// only play from the Launch click, and they stay quiet. No sound is fine, the sequence still plays.
let ctx: AudioContext | null = null;

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

/** Call from the Launch click, so the browser lets the sounds play later in the sequence. */
export function primeMissionSound() {
  try {
    context();
  } catch {
    // Quiet is fine.
  }
}

export function playCount() {
  try {
    const c = context();
    if (c) tone(c, c.currentTime + 0.01, 880, 880, 0.12, "square", 0.03);
  } catch {
    // Quiet is fine.
  }
}

export function playLiftoff() {
  try {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    tone(c, t, 50, 220, 1.6, "sawtooth", 0.05);
    tone(c, t, 90, 440, 1.6, "triangle", 0.02);
    tone(c, t + 0.05, 1200, 2400, 0.3, "sine", 0.02);
  } catch {
    // Quiet is fine.
  }
}

export function playPhase(ok: boolean) {
  try {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.01;
    if (ok) {
      tone(c, t, 660, 660, 0.1, "sine", 0.05);
      tone(c, t + 0.1, 990, 990, 0.18, "sine", 0.05);
    } else {
      tone(c, t, 180, 90, 0.45, "sawtooth", 0.05);
    }
  } catch {
    // Quiet is fine.
  }
}
