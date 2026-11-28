import { afterEach, describe, expect, it, vi } from "vitest";

const made: FakeAudio[] = [];
class FakeAudio {
  volume = 1;
  muted = false;
  loop = false;
  preload = "";
  currentTime = 0;
  playing = false;
  constructor(public src: string) {
    made.push(this);
  }
  play = vi.fn(async () => {
    this.playing = true;
  });
  pause = vi.fn(() => {
    this.playing = false;
  });
}

const song = (name: string) => made.find((a) => a.src.includes(name))!;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("parade music", () => {
  it("unlocks every song on the tap, then crossfades between them", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("Audio", FakeAudio);
    const { CROSSFADE_S, playParadeSound, primeParadeSound, stopParadeSound } = await import("./paradeSound");
    // The same order as the Start click: the first song, then the unlock of the rest.
    playParadeSound({ track: "liberty-bell" });
    primeParadeSound();
    expect(made).toHaveLength(4);
    for (const audio of made) expect(audio.play).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(made.filter((a) => a.playing)).toEqual([song("liberty-bell")]);
    expect(song("liberty-bell").volume).toBe(1);

    playParadeSound({ track: "drum-cadence" });
    await vi.advanceTimersByTimeAsync((CROSSFADE_S * 1000) / 2);
    expect(song("liberty-bell").volume).toBeGreaterThan(0.2);
    expect(song("drum-cadence").volume).toBeGreaterThan(0.2);
    await vi.advanceTimersByTimeAsync(CROSSFADE_S * 1000);
    expect(made.filter((a) => a.playing)).toEqual([song("drum-cadence")]);

    stopParadeSound();
    await vi.advanceTimersByTimeAsync(1000);
    expect(made.filter((a) => a.playing)).toEqual([]);
  });
});
