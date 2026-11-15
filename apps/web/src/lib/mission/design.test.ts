import { describe, expect, it } from "vitest";
import { choose, emptyDesign, toggleInstrument } from "./design";

describe("toggleInstrument", () => {
  it("adds an instrument, in the order picked", () => {
    const d = toggleInstrument(toggleInstrument(emptyDesign, "radar"), "nav-cam");
    expect(d.instrumentIds).toEqual(["radar", "nav-cam"]);
  });

  it("takes an instrument out when it is picked again", () => {
    const d = toggleInstrument(toggleInstrument(emptyDesign, "radar"), "radar");
    expect(d.instrumentIds).toEqual([]);
  });

  it("does not change the design it was given", () => {
    toggleInstrument(emptyDesign, "radar");
    expect(emptyDesign.instrumentIds).toEqual([]);
  });
});

describe("choose", () => {
  it("sets a slot", () => {
    expect(choose(emptyDesign, "vehicleId", "medium").vehicleId).toBe("medium");
  });

  it("replaces what was there", () => {
    const d = choose(choose(emptyDesign, "powerId", "solar-small"), "powerId", "solar-large");
    expect(d.powerId).toBe("solar-large");
  });

  it("clears the slot when the same part is chosen again", () => {
    const d = choose(choose(emptyDesign, "commsId", "uhf"), "commsId", "uhf");
    expect(d.commsId).toBeNull();
  });

  it("leaves the other slots alone", () => {
    const d = choose(choose(emptyDesign, "powerId", "solar-small"), "commsId", "x-band");
    expect(d.powerId).toBe("solar-small");
    expect(d.commsId).toBe("x-band");
  });
});
