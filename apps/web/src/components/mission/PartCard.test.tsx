import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PartCard from "./PartCard";

describe("PartCard", () => {
  it("shows the part and its numbers", () => {
    render(<PartCard name="Spectrometer" blurb="Reads rocks." stats={["8 kg", "$25M"]} selected={false} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /spectrometer/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("8 kg")).toBeInTheDocument();
    expect(screen.getByText("$25M")).toBeInTheDocument();
  });

  it("reports a pick when it is tapped", async () => {
    const onSelect = vi.fn();
    render(<PartCard name="Radar" blurb="" stats={[]} selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("shows it is picked", () => {
    render(<PartCard name="Radar" blurb="" stats={[]} selected onSelect={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
