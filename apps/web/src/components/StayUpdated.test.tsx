import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StayUpdated from "./StayUpdated";

describe("StayUpdated", () => {
  it("shows nothing without a form link", () => {
    render(<StayUpdated url={null} />);
    expect(screen.queryByTestId("stay-updated")).not.toBeInTheDocument();
  });

  it("opens the Flodesk form in a new tab and says where the email goes", () => {
    render(<StayUpdated url="https://my.flodesk.com/abc" />);
    const link = screen.getByRole("link", { name: /send me the updates/i });
    expect(link).toHaveAttribute("href", "https://my.flodesk.com/abc");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getByTestId("stay-updated")).toHaveTextContent("Your email goes to Flodesk");
  });
});
