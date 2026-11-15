import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { simulate, type Trouble } from "@/lib/mission";
import { balanced, tooHeavy } from "@/lib/mission/designs.fixtures";
import * as sound from "./missionSound";
import MissionStory from "./MissionStory";

vi.mock("./missionSound", () => ({
  playComms: vi.fn(),
  playCountdown: vi.fn(),
  playLiftoff: vi.fn(),
  playAlarm: vi.fn(),
  playFixed: vi.fn(),
  playSad: vi.fn(),
  playNoGo: vi.fn(),
  playPhase: vi.fn(),
  playSplash: vi.fn(),
  playWrench: vi.fn(),
  primeMissionSound: vi.fn(),
  setSoundEnabled: vi.fn(),
  startAmbience: vi.fn(),
  stopAmbience: vi.fn(),
}));

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const story = (d: Parameters<typeof simulate>[0], hold: number | null = null, trouble: Trouble | null = null) => render(<MissionStory design={d} result={simulate(d)} onDone={() => {}} hold={hold} trouble={trouble} />);

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.setItem("ff-story-speed", "1");
});
afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("the mission sounds", () => {
  it("plays the no-go buzzer, then the wrench, then the cheer, and no repair sounds when nothing goes wrong", () => {
    story(balanced);
    for (let i = 0; i < 600 && !(sound.playCountdown as ReturnType<typeof vi.fn>).mock.calls.length; i++) advance(100);
    expect(sound.playNoGo).not.toHaveBeenCalled();
    expect(sound.playWrench).not.toHaveBeenCalled();
  });

  it("sounds the alarm, then Piggy's sad melody, then the relief, when there is trouble in space", () => {
    story(balanced, null, { cause: 0, outcome: "continue" });
    for (let i = 0; i < 1500 && !(sound.playFixed as ReturnType<typeof vi.fn>).mock.calls.length; i++) advance(100);
    expect(sound.playAlarm).toHaveBeenCalledTimes(1);
    expect(sound.playSad).toHaveBeenCalledTimes(1);
    const order = (f: unknown) => (f as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    expect(order(sound.playAlarm)).toBeLessThan(order(sound.playSad));
    expect(order(sound.playSad)).toBeLessThan(order(sound.playFixed));
  });

  it("makes the buzzer, wrench, and cheer sounds, in order, when a system is no-go", () => {
    story(balanced, 1);
    for (let i = 0; i < 800 && !(sound.playCountdown as ReturnType<typeof vi.fn>).mock.calls.length; i++) advance(100);
    expect(sound.playNoGo).toHaveBeenCalledTimes(1);
    expect(sound.playWrench).toHaveBeenCalledTimes(1);
    expect(sound.playFixed).toHaveBeenCalledTimes(1);
    const order = (f: unknown) => (f as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    expect(order(sound.playNoGo)).toBeLessThan(order(sound.playWrench));
    expect(order(sound.playWrench)).toBeLessThan(order(sound.playFixed));
    expect(order(sound.playFixed)).toBeLessThan(order(sound.playCountdown));
  });

  it("counts down 3, 2, 1, liftoff, with a voice and a beep for each, and only after every check is in", () => {
    story(balanced);
    advance(1500);
    expect(sound.playCountdown).not.toHaveBeenCalled();
    for (let i = 0; i < 400 && (sound.playCountdown as ReturnType<typeof vi.fn>).mock.calls.length < 4; i++) advance(100);
    const countdown = (sound.playCountdown as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[0]);
    expect(countdown).toEqual(["3", "2", "1", "LIFTOFF"]);
    // All seven lines, the checks and the all clear, were spoken over comms before the first number.
    expect((sound.playComms as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(7);
  });

  it("starts a room ambience at Mission Control, and a space ambience in the next scene", () => {
    story(balanced);
    expect(sound.startAmbience).toHaveBeenLastCalledWith("room");
    for (let i = 0; i < 80; i++) advance(500);
    expect(sound.startAmbience).toHaveBeenCalledWith("space");
  });

  it("makes a comms blip each time the crew speak", () => {
    story(balanced);
    advance(1500);
    expect(sound.playComms).toHaveBeenCalledTimes(1);
    advance(5000);
    expect((sound.playComms as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(1);
  });

  it("plays the liftoff rumble in the liftoff scene", () => {
    story(balanced);
    for (let i = 0; i < 80; i++) advance(500);
    expect(sound.playLiftoff).toHaveBeenCalledOnce();
  });

  it("turns the sounds off and on with the toggle, and remembers the choice", () => {
    story(balanced);
    expect(screen.getByTestId("sound")).toHaveTextContent("Sound on");
    fireEvent.click(screen.getByTestId("sound"));
    expect(screen.getByTestId("sound")).toHaveTextContent("Sound off");
    expect(sound.setSoundEnabled).toHaveBeenLastCalledWith(false);
    expect(window.localStorage.getItem("ff-story-sound")).toBe("off");
    fireEvent.click(screen.getByTestId("sound"));
    expect(sound.setSoundEnabled).toHaveBeenLastCalledWith(true);
  });

  it("starts with the sound off when the visitor turned it off before", () => {
    window.localStorage.setItem("ff-story-sound", "off");
    story(balanced);
    expect(screen.getByTestId("sound")).toHaveTextContent("Sound off");
    expect(sound.setSoundEnabled).toHaveBeenCalledWith(false);
  });

  it("makes a low buzz at the end of a scrubbed launch", () => {
    story(tooHeavy);
    for (let i = 0; i < 80; i++) advance(500);
    expect(sound.playPhase).toHaveBeenCalledWith(false);
  });
});
