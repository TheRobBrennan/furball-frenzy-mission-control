import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { paradeFunnel } from "@/lib/analytics";
import { paradeScenes } from "@/lib/parade/script";
import ParadeShow from "./ParadeShow";
import { playParadeSound } from "./paradeSound";

vi.mock("@/lib/analytics", () => {
  const track = vi.fn();
  return { paradeFunnel: vi.fn(() => track) };
});
vi.mock("./paradeSound", () => ({ playParadeSound: vi.fn(), stopParadeSound: vi.fn() }));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

const scene = () => screen.getByTestId("parade-show").dataset.scene;
const start = () => fireEvent.click(screen.getByTestId("parade-start"));

describe("ParadeShow", () => {
  it("waits for the visitor, then marches on by itself", () => {
    vi.useFakeTimers();
    render(<ParadeShow />);
    expect(playParadeSound).not.toHaveBeenCalled();
    start();
    expect(scene()).toBe("whole-parade");
    expect(playParadeSound).toHaveBeenCalledWith("fanfare");
    act(() => void vi.advanceTimersByTime(paradeScenes[0].ms));
    expect(scene()).toBe("band-sports");
  });

  it("holds still while paused", () => {
    vi.useFakeTimers();
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => void vi.advanceTimersByTime(60_000));
    expect(scene()).toBe("whole-parade");
  });

  it("skips to Little Bear's goodbye, and plays again", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Skip to the end" }));
    expect(scene()).toBe("moon-float");
    expect(screen.getByText(/safety and silliness first/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
    expect(scene()).toBe("whole-parade");
  });

  it("reports the show: start, scenes, how it finished, a replay, and the sound choice", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip to the end" }));
    fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
    const track = vi.mocked(paradeFunnel).mock.results[0].value;
    expect(track).toHaveBeenCalledWith({ event: "parade_started" });
    expect(track).toHaveBeenCalledWith({ event: "parade_scene_viewed", scene: "whole-parade", title: "Parade Day", position: 1, total: paradeScenes.length });
    expect(track).toHaveBeenCalledWith({ event: "parade_sound_changed", sound: "off" });
    expect(track).toHaveBeenCalledWith({ event: "parade_finished", playback: "skipped" });
    expect(track).toHaveBeenCalledWith({ event: "parade_replayed" });
  });

  it("remembers sound turned off", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
    expect(screen.getByRole("button", { name: "Sound off" })).toBeInTheDocument();
    expect(window.localStorage.getItem("ff-story-sound")).toBe("off");
  });

  it("lets the visitor turn the pages when less motion is asked for", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    vi.useFakeTimers();
    render(<ParadeShow />);
    start();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(scene()).toBe("whole-parade");
    expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  });
});
