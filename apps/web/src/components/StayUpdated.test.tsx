import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import StayUpdated from "./StayUpdated";

type W = Window & { fd?: ((...a: unknown[]) => void) & { q?: unknown[][] }; FlodeskObject?: string };
afterEach(() => {
  delete (window as W).fd;
  delete (window as W).FlodeskObject;
  document.head.querySelectorAll("script[src*='flodesk']").forEach((s) => s.remove());
});

describe("StayUpdated", () => {
  it("shows nothing when it is turned off", () => {
    render(<StayUpdated id={null} />);
    expect(screen.queryByTestId("stay-updated")).not.toBeInTheDocument();
  });

  it("loads nothing from Flodesk until the visitor asks, then shows the form in the box", async () => {
    render(<StayUpdated id="6afa20d07c61c44f4b4fe6cc" />);
    expect(document.head.querySelectorAll("script[src*='flodesk']")).toHaveLength(0);
    expect(screen.getByTestId("stay-updated")).toHaveTextContent("Your email goes to Flodesk");
    fireEvent.click(screen.getByTestId("stay-updated-open"));
    await act(async () => void (await new Promise((r) => requestAnimationFrame(() => r(null)))));
    const box = screen.getByTestId("stay-updated-form");
    expect(document.head.querySelectorAll("script[src*='assets.flodesk.com']")).toHaveLength(2);
    expect((window as W).fd?.q).toEqual([["form", { formId: "6afa20d07c61c44f4b4fe6cc", containerEl: `#${box.id}` }]]);
    expect(screen.queryByTestId("stay-updated-open")).not.toBeInTheDocument();
  });
});
