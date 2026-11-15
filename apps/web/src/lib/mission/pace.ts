// How fast the mission story plays. The default is deliberately lazy so every scene and every line can be
// read and enjoyed, and the visitor can speed it up or slow it down with a slider.

export const MIN_SPEED = 0.25;
export const MAX_SPEED = 2;
export const DEFAULT_SPEED = 0.5;
export const SPEED_KEY = "ff-story-speed";

export const clampSpeed = (n: number): number => (Number.isFinite(n) ? Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(n * 100) / 100)) : DEFAULT_SPEED);

/** How long something of a given length takes at this speed. At 0.5 times it takes twice as long. */
export const scaled = (ms: number, speed: number): number => Math.round(ms / clampSpeed(speed));

export function speedLabel(speed: number): string {
  const s = clampSpeed(speed);
  if (s <= 0.4) return "Very lazy";
  if (s <= 0.8) return "Lazy";
  if (s <= 1.2) return "Normal";
  return "Quick";
}

/** Reads a saved speed, falling back to the lazy default when there is none or it is not a number. */
export function readSpeed(saved: string | null): number {
  if (saved === null) return DEFAULT_SPEED;
  const n = Number(saved);
  return Number.isFinite(n) ? clampSpeed(n) : DEFAULT_SPEED;
}

export const SOUND_KEY = "ff-story-sound";

/** Sound is on unless the visitor turned it off. */
export const readSound = (saved: string | null): boolean => saved !== "off";
