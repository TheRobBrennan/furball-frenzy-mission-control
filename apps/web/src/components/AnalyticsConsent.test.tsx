import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, resetAnalytics } from "@/lib/analytics";
import AnalyticsConsent from "./AnalyticsConsent";

const init = vi.fn();
vi.mock("posthog-js", () => ({ default: { init: (...a: unknown[]) => init(...a), capture: vi.fn() } }));
const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
  resetAnalytics();
  init.mockClear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("AnalyticsConsent", () => {
  it("shows nothing at all when analytics is not set up", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    render(<AnalyticsConsent />);
    advance(5000);
    expect(screen.queryByTestId("analytics-consent")).not.toBeInTheDocument();
  });

  it("asks once, and Yes remembers it and starts PostHog", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    render(<AnalyticsConsent />);
    advance(1600);
    expect(screen.getByTestId("analytics-consent")).toHaveTextContent("Typed text is never recorded");
    expect(screen.getByRole("link", { name: /privacy page/i })).toHaveAttribute("href", "/privacy");
    await act(async () => fireEvent.click(screen.getByTestId("analytics-yes")));
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("yes");
    expect(screen.queryByTestId("analytics-consent")).not.toBeInTheDocument();
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("No remembers it, starts nothing, and never asks again", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    const { unmount } = render(<AnalyticsConsent />);
    advance(1600);
    fireEvent.click(screen.getByTestId("analytics-no"));
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("no");
    expect(init).not.toHaveBeenCalled();
    unmount();
    render(<AnalyticsConsent />);
    advance(5000);
    expect(screen.queryByTestId("analytics-consent")).not.toBeInTheDocument();
    expect(init).not.toHaveBeenCalled();
  });

  it("starts by itself for a visitor who already said yes, without asking again", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    window.localStorage.setItem(CONSENT_KEY, "yes");
    await act(async () => void render(<AnalyticsConsent />));
    expect(init).toHaveBeenCalledTimes(1);
    advance(5000);
    expect(screen.queryByTestId("analytics-consent")).not.toBeInTheDocument();
  });
});
