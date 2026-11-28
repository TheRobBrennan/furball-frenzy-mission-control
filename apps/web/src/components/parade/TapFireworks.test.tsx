import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TapFireworks from "./TapFireworks";

describe("TapFireworks", () => {
  it("goes off where the visitor taps, but not on controls", () => {
    const onTap = vi.fn();
    render(
      <>
        <p>street</p>
        <button type="button">Next</button>
        <TapFireworks onTap={onTap} />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByTestId("firework")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("street"), { clientX: 40, clientY: 90, detail: 1 });
    expect(screen.getByTestId("firework")).toHaveStyle({ left: "40px", top: "90px" });
    expect(onTap).toHaveBeenCalledOnce();
  });
});
