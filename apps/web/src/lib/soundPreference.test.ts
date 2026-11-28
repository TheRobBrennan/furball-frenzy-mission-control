import { afterEach, describe, expect, it, vi } from "vitest";
import { saveSoundEnabled, soundEnabled, subscribeToSound } from "./soundPreference";

afterEach(() => window.localStorage.clear());

describe("sound preference", () => {
  it("is on until turned off, and tells whoever is listening", () => {
    const listener = vi.fn();
    const stop = subscribeToSound(listener);
    expect(soundEnabled()).toBe(true);
    saveSoundEnabled(false);
    expect(soundEnabled()).toBe(false);
    expect(window.localStorage.getItem("ff-story-sound")).toBe("off");
    expect(listener).toHaveBeenCalledOnce();
    stop();
  });
});
