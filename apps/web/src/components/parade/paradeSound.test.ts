import { afterEach, describe, expect, it, vi } from "vitest";

const ramps: [number, number][] = [];
const stops: number[] = [];

function fakeContext() {
  const node = () => ({ connect: vi.fn((next) => next), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn((at: number) => stops.push(at)), buffer: null, loop: false, type: "", frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() } });
  const gain = () => ({ ...node(), gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn(), linearRampToValueAtTime: vi.fn((v: number, at: number) => ramps.push([v, at])) } });
  return function FakeAudio() {
    return { state: "running", currentTime: 10, destination: {}, createOscillator: node, createBufferSource: node, createGain: gain, decodeAudioData: async () => ({}) };
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("parade music", () => {
  it("crossfades from one song to the next, and plays on within a song", async () => {
    vi.stubGlobal("AudioContext", fakeContext());
    vi.stubGlobal("fetch", async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }));
    const { CROSSFADE_S, playParadeSound } = await import("./paradeSound");
    const settle = () => new Promise((r) => setTimeout(r, 0));
    playParadeSound({ track: "liberty-bell" });
    await settle();
    ramps.length = 0;
    playParadeSound({ track: "liberty-bell" });
    expect(ramps).toEqual([]);
    playParadeSound({ track: "drum-cadence" });
    await settle();
    expect(ramps).toEqual([[0, 10 + CROSSFADE_S], [1, 10 + CROSSFADE_S]]);
    expect(stops).toContain(10 + CROSSFADE_S);
  });
});
