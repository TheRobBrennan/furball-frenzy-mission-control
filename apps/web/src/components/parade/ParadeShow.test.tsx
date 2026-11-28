import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { paradeFunnel } from "@/lib/analytics";
import { paradeScenes } from "@/lib/parade/script";
import ParadeShow from "./ParadeShow";
import { playCheer, playParadeSound } from "./paradeSound";

vi.mock("@/lib/analytics", () => {
  const track = vi.fn();
  return { paradeFunnel: vi.fn(() => track) };
});
vi.mock("./paradeSound", () => ({ playCheer: vi.fn(), playParadeSound: vi.fn(), primeParadeSound: vi.fn(), stopParadeSound: vi.fn() }));

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
    expect(scene()).toBe("piggy-hamley");
    expect(playParadeSound).toHaveBeenCalledWith(paradeScenes[0]);
    act(() => void vi.advanceTimersByTime(paradeScenes[0].ms));
    expect(scene()).toBe("bunnies");
  });

  it("shows the roped-off street and its presenters, and no balloons, before the start", () => {
    render(<ParadeShow />);
    expect(screen.getAllByRole("img").map((i) => i.getAttribute("alt"))).toEqual(["A city street roped off with barriers, crowds waiting for the parade", "Sploosh.AI"]);
    fireEvent.click(screen.getByRole("link", { name: /hockey analytics/i }));
    expect(vi.mocked(paradeFunnel).mock.results[0].value).toHaveBeenCalledWith({ event: "parade_sponsor_opened", sponsor: "hockey" });
  });

  it("holds still while paused", () => {
    vi.useFakeTimers();
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => void vi.advanceTimersByTime(60_000));
    expect(scene()).toBe("piggy-hamley");
  });

  it("skips to Little Bear's goodbye, and plays again", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Skip to the end" }));
    expect(scene()).toBe("moon-float");
    expect(screen.getByText(/safety and silliness first/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
    expect(scene()).toBe("piggy-hamley");
  });

  it("reports the show: start, scenes, how it finished, a replay, and the sound choice", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip to the end" }));
    fireEvent.click(screen.getByRole("button", { name: "Watch again" }));
    const track = vi.mocked(paradeFunnel).mock.results[0].value;
    expect(track).toHaveBeenCalledWith({ event: "parade_started" });
    expect(track).toHaveBeenCalledWith({ event: "parade_scene_viewed", scene: "piggy-hamley", title: "Piggy and Hamley", position: 1, total: paradeScenes.length });
    expect(track).toHaveBeenCalledWith({ event: "parade_sound_changed", sound: "off" });
    expect(track).toHaveBeenCalledWith({ event: "parade_finished", playback: "skipped" });
    expect(track).toHaveBeenCalledWith({ event: "parade_replayed" });
  });

  it("cheers when the picture is tapped", () => {
    render(<ParadeShow />);
    start();
    fireEvent.click(screen.getByRole("button", { name: "Cheer for the parade" }), { clientX: 10, clientY: 20, detail: 1 });
    expect(screen.getByTestId("firework")).toBeInTheDocument();
    expect(playCheer).toHaveBeenCalled();
    expect(vi.mocked(paradeFunnel).mock.results[0].value).toHaveBeenCalledWith({ event: "parade_cheered", scene: "piggy-hamley" });
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
    expect(scene()).toBe("piggy-hamley");
    expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
  });
});
