import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DemoPage from "@/app/demo/page";

describe("the demo page", () => {
  it("plays the 30 second video with controls, a poster, and a download fallback, no login", () => {
    const { container } = render(<DemoPage />);
    const video = screen.getByTestId("demo-video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("poster", "/demo/furball-frenzy-30s-poster.jpg");
    expect(container.querySelector("source")).toHaveAttribute("src", "/demo/furball-frenzy-30s.mp4");
    expect(screen.getByRole("link", { name: "Download it here" })).toHaveAttribute("href", "/demo/furball-frenzy-30s.mp4");
    expect(screen.getByRole("link", { name: "Watch a mission for real" })).toHaveAttribute("href", "/mission?judges=1");
  });
});
