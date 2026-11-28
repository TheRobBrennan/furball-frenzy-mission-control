// One sound choice for the whole site, saved in the browser. Sound is on unless the visitor turned it off.
import { readSound, SOUND_KEY } from "./mission/pace";

const changed = "furball-sound-preference";
// Still honored for the visit if the browser blocks storage.
let inMemory: boolean | undefined;

export function soundEnabled(): boolean {
  try {
    return inMemory ?? readSound(window.localStorage.getItem(SOUND_KEY));
  } catch {
    return inMemory ?? true;
  }
}

export function saveSoundEnabled(on: boolean) {
  inMemory = undefined;
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    inMemory = on;
  }
  window.dispatchEvent(new Event(changed));
}

export function subscribeToSound(listener: () => void) {
  window.addEventListener(changed, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changed, listener);
    window.removeEventListener("storage", listener);
  };
}
