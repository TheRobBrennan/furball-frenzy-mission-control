import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PromoSplash, { CAPTION_MS, PROMO_KEY } from "./PromoSplash";

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("PromoSplash", () => {
  it("appears a moment after the page loads, with a way to watch a mission or to design one", () => {
    render(<PromoSplash />);
    expect(screen.queryByTestId("promo")).not.toBeInTheDocument();
    advance(1300);
    expect(screen.getByRole("dialog", { name: /trailer/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /watch a mission/i })).toHaveAttribute("href", "/mission?judges=1");
    expect(screen.getByRole("link", { name: /design it myself/i })).toHaveAttribute("href", "/mission");
  });

  it("moves through its four lines on its own and stops on the last", () => {
    render(<PromoSplash />);
    advance(1300);
    expect(screen.getByTestId("promo-line")).toHaveTextContent("Two Polish elephants.");
    for (let i = 0; i < 5; i++) advance(CAPTION_MS);
    expect(screen.getByTestId("promo-line")).toHaveTextContent("Design the mission that gets them there.");
  });

  it.each([
    ["the close button", () => fireEvent.click(screen.getByTestId("promo-close"))],
    ["Escape", () => fireEvent.keyDown(window, { key: "Escape" })],
    ["a click outside", () => fireEvent.click(screen.getByTestId("promo-backdrop"))],
  ])("closes with %s, and does not come back this visit", (_name, close) => {
    const { unmount } = render(<PromoSplash />);
    advance(1300);
    close();
    expect(screen.queryByTestId("promo")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(PROMO_KEY)).toBe("1");
    unmount();
    render(<PromoSplash />);
    advance(3000);
    expect(screen.queryByTestId("promo")).not.toBeInTheDocument();
  });

  it("puts focus on the close button when it opens", () => {
    render(<PromoSplash />);
    advance(1300);
    expect(screen.getByTestId("promo-close")).toHaveFocus();
  });

  it("stays still with every line shown when the visitor asked for less motion", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {}, media: q }));
    render(<PromoSplash />);
    advance(1300);
    expect(screen.getByTestId("promo-line")).toHaveTextContent("Two Polish elephants. One lifelong dream. A rover bound for the Moon. Design the mission that gets them there.");
  });
});
