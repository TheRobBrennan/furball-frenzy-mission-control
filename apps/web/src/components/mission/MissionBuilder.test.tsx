import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MissionBuilder from "./MissionBuilder";

const pick = (name: RegExp) => userEvent.click(screen.getByRole("button", { name }));

const launch = async () => {
  await userEvent.click(screen.getByTestId("launch"));
  await userEvent.click(screen.getByRole("button", { name: /skip to the debrief/i }));
};

async function buildBalanced() {
  await pick(/medium launcher/i);
  await pick(/navigation camera/i);
  await pick(/spectrometer/i);
  await pick(/medium solar array/i);
  await pick(/x-band dish/i);
}

describe("MissionBuilder", () => {
  it("starts with the launch locked, and says what is missing", () => {
    render(<MissionBuilder />);
    expect(screen.getByTestId("launch")).toBeDisabled();
    expect(screen.getByTestId("launch")).toHaveTextContent("Launch locked");
    expect(screen.getByTestId("issues")).toHaveTextContent("Pick a launch vehicle");
  });

  it("keeps a compact strip of the six gauges in view too, for a phone", () => {
    render(<MissionBuilder />);
    for (const id of ["mass", "power", "budget", "data", "comms", "time"]) expect(screen.getByTestId(`gauge-compact-${id}`)).toBeInTheDocument();
  });

  it("shows all six gauges", () => {
    render(<MissionBuilder />);
    for (const id of ["mass", "power", "budget", "data", "comms", "time"]) expect(screen.getByTestId(`gauge-${id}`)).toBeInTheDocument();
  });

  it("unlocks the launch for a balanced design, and the debrief shows success", async () => {
    render(<MissionBuilder />);
    await buildBalanced();
    expect(screen.getByTestId("launch")).toBeEnabled();
    await launch();
    expect(screen.getByRole("heading", { name: /mission success/i })).toBeInTheDocument();
    expect(screen.getByTestId("science")).toHaveTextContent("Science returned: 100%");
  });

  it("tells the mission story first, and the debrief comes after it", async () => {
    render(<MissionBuilder />);
    await buildBalanced();
    await userEvent.click(screen.getByTestId("launch"));
    expect(screen.getByRole("dialog", { name: /the mission story/i })).toBeInTheDocument();
    expect(screen.queryByTestId("debrief")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /skip to the debrief/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("debrief")).toBeInTheDocument();
  });

  it("ticks each step as it is completed", async () => {
    render(<MissionBuilder />);
    for (const n of [1, 2, 3, 4]) expect(screen.getByTestId(`step-${n}-open`)).toBeInTheDocument();
    await buildBalanced();
    for (const n of [1, 2, 3, 4]) expect(screen.getByTestId(`step-${n}-done`)).toBeInTheDocument();
  });

  it("keeps the launch locked, with the reason, when the rover is too heavy", async () => {
    render(<MissionBuilder />);
    await pick(/small launcher/i);
    for (const n of [/navigation camera/i, /seismometer/i, /spectrometer/i, /radar/i, /sample drill/i]) await pick(n);
    await pick(/large solar array/i);
    await pick(/ka-band dish/i);
    expect(screen.getByTestId("launch")).toBeDisabled();
    expect(screen.getByTestId("issues")).toHaveTextContent(/too heavy/);
  });

  it("clears the debrief when the design changes, and starts over from empty", async () => {
    render(<MissionBuilder />);
    await buildBalanced();
    await launch();
    await pick(/radar/i);
    expect(screen.queryByTestId("debrief")).not.toBeInTheDocument();
    await pick(/radar/i);
    await launch();
    expect(screen.getByTestId("debrief")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(screen.queryByTestId("debrief")).not.toBeInTheDocument();
    expect(screen.getByTestId("launch")).toBeDisabled();
  });

  it("explains the biggest loss when the antenna is too small", async () => {
    render(<MissionBuilder />);
    await pick(/small launcher/i);
    for (const n of [/spectrometer/i, /radar/i, /sample drill/i]) await pick(n);
    await pick(/large solar array/i);
    await pick(/uhf antenna/i);
    await launch();
    expect(screen.getByTestId("biggest-loss")).toHaveTextContent(/antenna/i);
    expect(screen.getByRole("heading", { name: /fell short/i })).toBeInTheDocument();
  });
});
