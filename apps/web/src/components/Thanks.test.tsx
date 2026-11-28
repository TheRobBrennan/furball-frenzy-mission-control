import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThanksPage, { metadata } from "@/app/thanks/page";

describe("the thank you page", () => {
  it("thanks the new subscriber from the Polish elephants and the crew, and offers a mission", () => {
    render(<ThanksPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Thank you!" })).toBeInTheDocument();
    expect(screen.getByText(/Polish elephants, Piggy, and the whole furball crew/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Watch a mission" })).toHaveAttribute("href", "/missions/lunar-south-pole?judges=1");
    expect(screen.getByRole("link", { name: "Back to Mission Control" })).toHaveAttribute("href", "/");
  });

  it("shows the furballs photo and the crew, with confetti, instead of only text", () => {
    render(<ThanksPage />);
    expect(screen.getByRole("img", { name: /Polish elephants and Piggy, waving hello/ })).toBeInTheDocument();
    expect(screen.getByTestId("thanks-photo")).toHaveTextContent("Waving hello, just for you");
    expect(screen.getByTestId("confetti").children.length).toBeGreaterThan(10);
    // The crew row is six equal cells on one baseline.
    const row = screen.getByTestId("thanks-crew");
    expect(row.children).toHaveLength(6);
    expect(row.className).toContain("items-end");
  });

  it("stays out of search results, since it is only for new subscribers", () => {
    expect(metadata.robots).toEqual({ index: false });
  });
});
