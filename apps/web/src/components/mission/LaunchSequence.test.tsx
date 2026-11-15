import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { simulate } from "@/lib/mission";
import { balanced, powerStarved } from "@/lib/mission/designs.fixtures";
import LaunchSequence from "./LaunchSequence";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("LaunchSequence", () => {
  it("counts down, lifts off, ticks each phase, and then finishes", () => {
    const onDone = vi.fn();
    render(<LaunchSequence result={simulate(balanced)} onDone={onDone} />);
    expect(screen.getByRole("dialog", { name: /launch sequence/i })).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(10));
    expect(screen.getByTestId("launch-count")).toHaveTextContent("3");
    act(() => void vi.advanceTimersByTime(1400));
    expect(screen.getByTestId("launch-count")).toHaveTextContent("1");
    act(() => void vi.advanceTimersByTime(700));
    expect(screen.getByTestId("launch-count")).toHaveTextContent("Liftoff!");
    expect(onDone).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(900));
    expect(screen.getByText(/Launch\./)).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(6000));
    expect(screen.getByText(/Working on the surface\./)).toBeInTheDocument();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("shows a failed phase with a cross", () => {
    render(<LaunchSequence result={simulate(powerStarved)} onDone={() => {}} />);
    act(() => void vi.advanceTimersByTime(7000));
    expect(screen.getByText("✘")).toBeInTheDocument();
  });

  it("finishes at once, only once, when skipped", () => {
    const onDone = vi.fn();
    render(<LaunchSequence result={simulate(balanced)} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: /skip to the debrief/i }));
    act(() => void vi.advanceTimersByTime(10000));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("finishes when Escape is pressed", () => {
    const onDone = vi.fn();
    render(<LaunchSequence result={simulate(balanced)} onDone={onDone} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onDone).toHaveBeenCalledOnce();
  });
});
