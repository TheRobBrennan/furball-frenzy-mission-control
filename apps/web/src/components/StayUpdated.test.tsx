import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import StayUpdated from "./StayUpdated";

type W = Window & { fd?: ((...a: unknown[]) => void) & { q?: unknown[][] }; FlodeskObject?: string };
afterEach(() => {
  delete (window as W).fd;
  delete (window as W).FlodeskObject;
  document.head.querySelectorAll("script[src*='flodesk']").forEach((s) => s.remove());
});
const frame = () => act(async () => void (await new Promise((r) => requestAnimationFrame(() => r(null)))));

describe("StayUpdated", () => {
  it("shows nothing when it is turned off", () => {
    render(<StayUpdated id={null} />);
    expect(screen.queryByTestId("stay-updated")).not.toBeInTheDocument();
  });

  it("invites folks to the news, missions, games, and mischief of the furballs and the Polish elephants, with the crew waving", () => {
    render(<StayUpdated id="6afa20d07c61c44f4b4fe6cc" />);
    expect(screen.getByRole("heading", { name: "Join the furball crew" })).toBeInTheDocument();
    expect(screen.getByTestId("stay-updated-line")).toHaveTextContent("latest news, missions, games, and mischievous adventures of the furballs and those two Polish elephants");
    expect(screen.getByTestId("stay-updated-crew").children).toHaveLength(6);
    expect(screen.getByTestId("stay-updated")).toHaveTextContent("never spam");
  });

  it("loads nothing from Flodesk until the visitor asks, then shows the form in a pop-up", async () => {
    render(<StayUpdated id="6afa20d07c61c44f4b4fe6cc" />);
    expect(document.head.querySelectorAll("script[src*='flodesk']")).toHaveLength(0);
    expect(screen.queryByTestId("stay-updated-dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("stay-updated-open"));
    await frame();
    const box = screen.getByTestId("stay-updated-form");
    expect(screen.getByRole("dialog", { name: /sign up for the dispatches/i })).toBeInTheDocument();
    expect(screen.getByTestId("stay-updated-dialog")).toHaveTextContent("quick email to confirm it is really you");
    expect(document.head.querySelectorAll("script[src*='assets.flodesk.com']")).toHaveLength(2);
    expect((window as W).fd?.q).toEqual([["form", { formId: "6afa20d07c61c44f4b4fe6cc", containerEl: `#${box.id}` }]]);
    expect(screen.getByTestId("stay-updated-close")).toHaveFocus();
  });

  it.each([
    ["the close button", () => fireEvent.click(screen.getByTestId("stay-updated-close"))],
    ["Escape", () => fireEvent.keyDown(window, { key: "Escape" })],
    ["a click outside", () => fireEvent.click(screen.getByTestId("stay-updated-backdrop"))],
  ])("closes with %s and puts focus back on the button", async (_n, close) => {
    render(<StayUpdated id="6afa20d07c61c44f4b4fe6cc" />);
    fireEvent.click(screen.getByTestId("stay-updated-open"));
    await frame();
    close();
    expect(screen.queryByTestId("stay-updated-dialog")).not.toBeInTheDocument();
    if (_n !== "Escape") expect(screen.getByTestId("stay-updated-open")).toHaveFocus();
  });
});
