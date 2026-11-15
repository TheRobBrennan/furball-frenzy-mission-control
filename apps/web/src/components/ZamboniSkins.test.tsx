import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ZamboniModel from "./ZamboniModel";
import { skins } from "./ZamboniSkins";

describe("the Zamboni skins", () => {
  it("has the seven skins, each with a unique id", () => {
    expect(skins).toHaveLength(7);
    expect(new Set(skins.map((s) => s.id)).size).toBe(skins.length);
  });

  it("links every skin to an https site", () => {
    for (const skin of skins) expect(skin.href).toMatch(/^https:\/\//);
  });

  it("credits both Claude models on the Claude skin, with a caption short enough for one line", () => {
    const claude = skins.find((s) => s.id === "claude");
    expect(claude?.name).toContain("Sonnet 5.5");
    expect(claude?.name).toContain("Fable 5.2");
    expect((claude?.short ?? claude?.name ?? "").length).toBeLessThanOrEqual(20);
  });

  it("has a Software Mansion skin that links to their site and credits the elephants' home", () => {
    const swm = skins.find((s) => s.id === "swm");
    expect(swm?.name).toBe("Software Mansion");
    expect(swm?.href).toBe("https://swmansion.com/");
    expect(swm?.line).toMatch(/Polish elephants/);
  });

  it("paints each skin on the model with an accessible name", () => {
    for (const skin of skins) {
      const { unmount } = render(<ZamboniModel skin={skin} />);
      expect(screen.getByRole("img", { name: new RegExp(skin.name) })).toBeInTheDocument();
      unmount();
    }
  });
});
