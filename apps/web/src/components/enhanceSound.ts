// The Enhance sound, made on the spot, so there is no audio file to ship: three quick digital blips, a
// sweep that rises as the image gets sharper, and a flat, deadpan voice saying the word, in the spirit
// of every investigator who has ever said it to a screen. Zooming back out plays a short falling
// sweep. It only plays from a click, and it stays quiet.
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
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(amp).connect(c.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

// A flat computer voice, if the browser has one. It is optional, the beeps carry the joke without it.
function speak(word: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const say = new SpeechSynthesisUtterance(word);
  say.rate = 0.85;
  say.pitch = 0.5;
  say.volume = 0.7;
  window.speechSynthesis.cancel();
  window.setTimeout(() => window.speechSynthesis.speak(say), 330);
}

export function playEnhance(step: number) {
  try {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.02;
    const base = 520 + step * 140;
    tone(c, t, base, base, 0.06, "square", 0.035);
    tone(c, t + 0.09, base * 1.25, base * 1.25, 0.06, "square", 0.035);
    tone(c, t + 0.18, base * 1.5, base * 1.5, 0.06, "square", 0.035);
    tone(c, t + 0.3, base * 0.8, base * 3.2, 0.42, "sine", 0.06);
    tone(c, t + 0.3, base * 1.6, base * 6.4, 0.42, "triangle", 0.018);
    speak("Enhance.");
  } catch {
    // No sound is fine, the zoom still works.
  }
}

export function playZoomOut() {
  try {
    const c = context();
    if (!c) return;
    const t = c.currentTime + 0.02;
    tone(c, t, 1400, 360, 0.32, "sine", 0.05);
  } catch {
    // No sound is fine.
  }
}
