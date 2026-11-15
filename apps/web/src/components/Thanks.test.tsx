import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThanksPage, { metadata } from "@/app/thanks/page";

describe("the thank you page", () => {
  it("thanks the new subscriber from the Polish elephants and the crew, and offers a mission", () => {
    render(<ThanksPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Thank you!" })).toBeInTheDocument();
    expect(screen.getByText(/Polish elephants, Piggy, and the whole furball crew/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Watch a mission" })).toHaveAttribute("href", "/mission?judges=1");
    expect(screen.getByRole("link", { name: "Back to Mission Control" })).toHaveAttribute("href", "/");
  });

  it("stays out of search results, since it is only for new subscribers", () => {
    expect(metadata.robots).toEqual({ index: false });
  });
});
