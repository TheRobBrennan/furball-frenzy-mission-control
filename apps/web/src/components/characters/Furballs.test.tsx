import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { names, NC_CREW, type Who } from "@/lib/mission";
import Furball from "./Furballs";

describe("Furball", () => {
  it("draws every character with an accessible name", () => {
    const all: Who[] = [...NC_CREW, "little-bear"];
    for (const who of all) {
      const { unmount } = render(<Furball who={who} label={names[who]} />);
      expect(screen.getByRole("img", { name: names[who] })).toBeInTheDocument();
      unmount();
    }
  });

  it("has the Polish elephants wave only when asked to", () => {
    const { container, rerender } = render(<Furball who="elephants" label="The Polish elephants" />);
    expect(container.querySelectorAll(".story-wave")).toHaveLength(0);
    rerender(<Furball who="elephants" label="The Polish elephants" waving />);
    expect(container.querySelectorAll(".story-wave")).toHaveLength(2);
  });

  it("gives a worried furball a sweat drop and a cheerful one none", () => {
    const { container, rerender } = render(<Furball who="piggy" mood="worry" label="Piggy" />);
    const worried = container.querySelectorAll("path").length;
    rerender(<Furball who="piggy" mood="cheer" label="Piggy" />);
    expect(container.querySelectorAll("path").length).toBeLessThan(worried);
  });
});
