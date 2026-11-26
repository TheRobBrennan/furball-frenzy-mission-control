import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { missionScript, simulate, type Trouble } from "@/lib/mission";
import { balanced, dataStarved, tooHeavy } from "@/lib/mission/designs.fixtures";
import MissionStory from "./MissionStory";

const story = (d: Parameters<typeof simulate>[0], onDone = () => {}, hold: number | null = null, trouble: Trouble | null = null) => render(<MissionStory design={d} result={simulate(d)} onDone={onDone} hold={hold} trouble={trouble} />);
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
// Each scene schedules the next one after it renders, so play through in steps, as a visitor would.
const playThrough = (steps = 80) => {
  for (let i = 0; i < steps; i++) advance(5000);
};
// Plays on in small steps until the scene title shows, the way a visitor waits for the next scene.
const until = (title: string, limit = 600) => {
  for (let i = 0; i < limit && screen.getByTestId("scene-title").textContent !== title; i++) advance(500);
};

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.setItem("ff-story-speed", "1");
});
afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("MissionStory", () => {
  it("opens at Mission Control with the whole North Carolina crew, who check in before the countdown, 3, 2, 1, liftoff", () => {
    story(balanced);
    expect(screen.getByRole("dialog", { name: /the mission story/i })).toBeInTheDocument();
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Mission Control");
    for (const name of ["Piggy", "The Polish elephants", "The Gray Elephant", "Hamley", "Blue Bear", "Little Duck"]) expect(screen.getByRole("img", { name })).toBeInTheDocument();
    // No countdown while the checks are being called out.
    advance(500);
    expect(screen.getByTestId("scene-control")).toHaveTextContent("CHECKS");
    expect(screen.getAllByTestId("check-pending")).toHaveLength(5);
    for (let i = 0; i < 200 && !screen.queryByText("All systems go"); i++) advance(500);
    expect(screen.queryAllByTestId("check-pending")).toHaveLength(0);
    expect(screen.getAllByTestId("check-go")).toHaveLength(5);
    expect(screen.getByTestId("scene-control")).not.toHaveTextContent("3");
    for (let i = 0; i < 100 && !/LIFTOFF/.test(screen.getByTestId("scene-control").textContent ?? ""); i++) advance(100);
    expect(screen.getByTestId("scene-control")).toHaveTextContent("LIFTOFF");
    until("Liftoff");
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Liftoff");
  }, 30_000);

  it("plays every scene of a good mission, including the joyride with Little Bear looking on, then waits for the visitor", () => {
    const onDone = vi.fn();
    story(balanced, onDone);
    for (const title of ["Mission Control", "Liftoff", "The trip to the Moon", "Landing at the south pole", "Working on the surface", "A little me time", "Splashdown", "Safe recovery", "Mission success!"]) {
      until(title);
      expect(screen.getByTestId("scene-title")).toHaveTextContent(title);
    }
    expect(onDone).not.toHaveBeenCalled();
    expect(screen.getByTestId("lesson")).toHaveTextContent("What worked");
    fireEvent.click(screen.getByRole("button", { name: /see the debrief/i }));
    expect(onDone).toHaveBeenCalledExactlyOnceWith("completed");
  });

  it("shows the captions one by one, and keeps them on screen as a transcript", () => {
    story(balanced);
    expect(screen.getByTestId("story-lines").querySelectorAll("p")).toHaveLength(0);
    advance(1500);
    expect(screen.getByTestId("story-lines").querySelectorAll("p")).toHaveLength(1);
    advance(6000);
    expect(screen.getByTestId("story-lines").querySelectorAll("p").length).toBeGreaterThan(1);
    expect(screen.getByTestId("story-lines")).toHaveTextContent("Mission Control is go");
  });

  it("puts the newest message at the top of the transcript, each stamped in UTC and local time", () => {
    const fixed = new Date("2026-11-15T17:32:07Z");
    render(<MissionStory design={balanced} result={simulate(balanced)} onDone={() => {}} clock={() => fixed} />);
    advance(1500);
    advance(6000);
    const lines = screen.getByTestId("story-lines").querySelectorAll("p");
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toHaveTextContent("Elephants".length ? /The Polish elephants:|Gray|Hamley/ : "");
    expect(lines[lines.length - 1]).toHaveTextContent("Mission Control is go");
    const stamps = screen.getAllByTestId("stamp");
    expect(stamps).toHaveLength(lines.length);
    expect(stamps[0]).toHaveTextContent("17:32:07 UTC");
    expect(stamps[0].getAttribute("dateTime")).toBe("2026-11-15T17:32:07.000Z");
  });

  it("holds still when paused and carries on from the same moment when played", () => {
    story(balanced);
    advance(300);
    fireEvent.click(screen.getByTestId("pause"));
    expect(screen.getByTestId("pause")).toHaveTextContent("Play");
    advance(60_000);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Mission Control");
    expect(screen.getByTestId("scene-control")).toHaveTextContent("CHECKS");
    expect(screen.getByTestId("story-lines").querySelectorAll("p")).toHaveLength(0);
    fireEvent.click(screen.getByTestId("pause"));
    // The first caption was 900ms away when it paused, so it appears about a second after play.
    advance(1000);
    expect(screen.getByTestId("story-lines").querySelectorAll("p")).toHaveLength(1);
  });

  it("holds the countdown when a system reports no-go, shows the fix, and resumes only once it is go again", () => {
    story(balanced, () => {}, 2);
    for (let i = 0; i < 200 && !screen.queryByTestId("check-nogo"); i++) advance(100);
    expect(screen.getByTestId("check-nogo")).toHaveTextContent("Comms");
    expect(screen.getByTestId("scene-control")).toHaveTextContent("HOLD");
    expect(screen.getByText("Countdown on hold")).toBeInTheDocument();
    expect(screen.getByTestId("crew-grumble")).toBeInTheDocument();
    for (let i = 0; i < 200 && !screen.queryByTestId("check-fixing"); i++) advance(100);
    expect(screen.getByTestId("crew-fixing")).toBeInTheDocument();
    expect(screen.getByTestId("scene-control")).toHaveTextContent("HOLD");
    for (let i = 0; i < 200 && screen.queryByTestId("check-fixing"); i++) advance(100);
    expect(screen.queryByText("Countdown on hold")).not.toBeInTheDocument();
    expect(screen.getByTestId("crew-happy")).toBeInTheDocument();
    for (let i = 0; i < 400 && !/LIFTOFF/.test(screen.getByTestId("scene-control").textContent ?? ""); i++) advance(100);
    expect(screen.getByTestId("scene-control")).toHaveTextContent("LIFTOFF");
    expect(screen.getAllByTestId("check-go")).toHaveLength(5);
  });

  it("shows Piggy's tearful photo in trouble, then his smile when the crew is back on track", () => {
    story(balanced, () => {}, null, { cause: 1, outcome: "continue" });
    until("Trouble in space");
    expect(screen.getByTestId("scene-emergency")).toBeInTheDocument();
    expect(screen.getByTestId("piggy-ipad")).toHaveAttribute("data-mood", "sad");
    expect(screen.getByRole("img", { name: /polish elephants, in the photo/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("crew-grumble").length).toBeGreaterThan(0);
    until("Back on track");
    expect(screen.getByTestId("piggy-ipad")).toHaveAttribute("data-mood", "happy");
    until("Landing at the south pole");
    expect(screen.queryByTestId("piggy-ipad")).not.toBeInTheDocument();
  });

  it("turns for home when the trouble is serious, skips the Moon, and ends safe", () => {
    story(balanced, () => {}, null, { cause: 0, outcome: "abort" });
    until("Turning for home");
    until("Splashdown");
    until("Safe recovery");
    until("Home safe");
    expect(screen.getByTestId("lesson")).toHaveTextContent("Turning back is a good call");
  });

  it("counts down to splashdown, lands on SPLASH, and celebrates with a reunion", () => {
    story(balanced);
    until("Splashdown");
    expect(screen.getByTestId("scene-splashdown")).toHaveTextContent("RE-ENTRY");
    for (let i = 0; i < 300 && !/SPLASH/.test(screen.getByTestId("scene-splashdown").textContent ?? ""); i++) advance(100);
    expect(screen.getByTestId("scene-splashdown")).toHaveTextContent("SPLASH");
    until("Safe recovery");
    for (let i = 0; i < 100 && !screen.queryByText(/waving and cheering/); i++) advance(500);
    expect(screen.getByTestId("story-lines")).toHaveTextContent("waving and cheering");
  });

  it("puts each speaker's furball icon to the left of their name in the transcript", () => {
    story(balanced);
    advance(1500);
    const icons = screen.getAllByTestId("line-icon");
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].nextElementSibling).toHaveTextContent("Piggy:");
    expect(icons[0].querySelector("svg")).toBeInTheDocument();
  });

  it("brings the crew home with a splashdown and a headcount of everyone safe", () => {
    story(balanced);
    until("Safe recovery");
    for (let i = 0; i < 60 && !screen.queryByTestId("headcount"); i++) advance(500);
    const headcount = screen.getByTestId("headcount");
    expect(headcount).toHaveTextContent("All paws, trunks, snouts, and tails accounted for");
    for (const name of ["Piggy", "The Polish elephants", "The Gray Elephant", "Hamley", "Blue Bear", "Little Duck"]) expect(headcount).toHaveTextContent(`${name}, safe`);
    expect(screen.getByTestId("scene-recovery")).toBeInTheDocument();
  });

  it("ends a mission that fell short with the learning point", () => {
    story(dataStarved);
    until("What we learned");
    expect(screen.getByTestId("scene-title")).toHaveTextContent("What we learned");
    expect(screen.getByTestId("lesson")).toHaveTextContent(/gets home/);
  });

  it("scrubs at Mission Control when the launch cannot happen, and teaches the reason", () => {
    story(tooHeavy);
    expect(screen.getByTestId("scene-control")).toHaveTextContent("HOLD");
    until("What we learned");
    expect(screen.getByTestId("lesson")).toHaveTextContent("Mass is the first limit");
  });

  it("finishes at once, only once, when skipped or on Escape", () => {
    const onDone = vi.fn();
    story(balanced, onDone);
    fireEvent.click(screen.getByRole("button", { name: /skip to the debrief/i }));
    fireEvent.keyDown(window, { key: "Escape" });
    playThrough();
    expect(onDone).toHaveBeenCalledExactlyOnceWith("skipped");
  });

  it("with reduced motion waits for a tap on Next, and shows every line at once", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    story(balanced);
    expect(screen.getByTestId("story-lines").querySelectorAll("p").length).toBeGreaterThan(1);
    playThrough(8);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Mission Control");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Liftoff");
  });

  it("defaults to a lazy pace, so a scene lasts twice as long as at normal speed", () => {
    window.localStorage.clear();
    story(balanced);
    expect(screen.getByTestId("speed-label")).toHaveTextContent("Lazy 0.5x");
    const normal = missionScript(balanced, simulate(balanced))[0].ms;
    advance(normal + 500);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Mission Control");
    advance(normal);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Liftoff");
  });

  it("changes the pace when the slider is let go, remembers it, and plays the scene again from the start", () => {
    story(balanced);
    const slider = screen.getByTestId("speed");
    fireEvent.change(slider, { target: { value: "0.5" } });
    expect(screen.getByTestId("speed-label")).toHaveTextContent("Lazy 0.5x");
    fireEvent.keyUp(slider);
    expect(window.localStorage.getItem("ff-story-speed")).toBe("0.5");
    const normal = missionScript(balanced, simulate(balanced))[0].ms;
    advance(normal + 500);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Mission Control");
    advance(normal);
    expect(screen.getByTestId("scene-title")).toHaveTextContent("Liftoff");
  });

  it("starts at the speed that was saved", () => {
    window.localStorage.setItem("ff-story-speed", "1.5");
    story(balanced);
    expect(screen.getByTestId("speed-label")).toHaveTextContent("Quick 1.5x");
  });

  it("has no slider with reduced motion, where nothing is timed", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    story(balanced);
    expect(screen.queryByTestId("speed")).not.toBeInTheDocument();
  });
});
