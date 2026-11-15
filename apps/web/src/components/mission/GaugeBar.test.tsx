import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GaugeBar from "./GaugeBar";

const gauge = (over: Partial<Parameters<typeof GaugeBar>[0]["gauge"]> = {}) => ({ id: "mass" as const, label: "Mass", unit: "kg", used: 100, limit: 400, status: "ok" as const, ...over });

describe("GaugeBar", () => {
  it("says how much is used of how much there is", () => {
    render(<GaugeBar gauge={gauge()} />);
    expect(screen.getByText("100 of 400 kg")).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Mass" })).toHaveAttribute("aria-valuetext", "100 of 400 kg, OK");
  });

  it("fills in proportion, and never past the end", () => {
    const { rerender } = render(<GaugeBar gauge={gauge()} />);
    expect(screen.getByRole("meter").firstElementChild).toHaveStyle({ width: "25%" });
    rerender(<GaugeBar gauge={gauge({ used: 900, status: "over" })} />);
    expect(screen.getByRole("meter").firstElementChild).toHaveStyle({ width: "100%" });
    expect(screen.getByTestId("gauge-mass")).toHaveAttribute("data-status", "over");
  });

  it("stays empty with no limit yet", () => {
    render(<GaugeBar gauge={gauge({ limit: 0 })} />);
    expect(screen.getByText("100 kg")).toBeInTheDocument();
    expect(screen.getByRole("meter").firstElementChild).toHaveStyle({ width: "0%" });
  });

  it("shows only the label and the bar when compact", () => {
    render(<GaugeBar gauge={gauge()} compact />);
    expect(screen.getByText("Mass")).toBeInTheDocument();
    expect(screen.queryByText("100 of 400 kg")).not.toBeInTheDocument();
    expect(screen.getByTestId("gauge-compact-mass")).toBeInTheDocument();
  });
});
