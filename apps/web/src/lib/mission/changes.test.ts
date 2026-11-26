import { describe, expect, it } from "vitest";
import { designChanges } from "./changes";
import { emptyDesign } from "./design";
import type { Design } from "./types";

const ready: Design = { vehicleId: "medium", powerId: "solar-medium", commsId: "x-band", instrumentIds: ["nav-cam"] };
const of = <E extends string>(changes: ReturnType<typeof designChanges>, event: E) => changes.filter((c) => c.event === event);

describe("designChanges", () => {
  it("says nothing when nothing changed", () => {
    expect(designChanges(ready, { ...ready })).toEqual([]);
  });

  it("reports an add, a remove, and a replacement", () => {
    expect(of(designChanges(emptyDesign, { ...emptyDesign, vehicleId: "small" }), "mission_part_changed")).toEqual([
      { event: "mission_part_changed", category: "launcher", action: "add", from: "", to: "small" },
    ]);
    expect(designChanges(ready, { ...ready, instrumentIds: [] })[0]).toMatchObject({ category: "instrument", action: "remove", from: "nav-cam", to: "" });
    expect(designChanges(ready, { ...ready, commsId: "uhf" })[0]).toMatchObject({ category: "comms", action: "replace", from: "x-band", to: "uhf" });
  });

  it("reports a blocking limit and its recovery", () => {
    const heavy: Design = { vehicleId: "small", powerId: "solar-large", commsId: "ka-band", instrumentIds: ["drill", "radar", "spectrometer", "seismometer"] };
    const fits: Design = { ...heavy, vehicleId: "medium" };
    expect(designChanges(fits, heavy)).toContainEqual({ event: "mission_limit_changed", limit: "mass", direction: "exceeded", blocks_launch: true });
    expect(designChanges(heavy, fits)).toContainEqual({ event: "mission_limit_changed", limit: "mass", direction: "resolved", blocks_launch: true });
  });

  it("reports a data shortfall that still permits launch", () => {
    const changes = designChanges(ready, { ...ready, commsId: "uhf", instrumentIds: ["spectrometer"] });
    expect(changes).toContainEqual({ event: "mission_limit_changed", limit: "data", direction: "exceeded", blocks_launch: false });
    expect(of(changes, "mission_launch_blockers_changed")).toEqual([]);
  });

  it("reports one edit that clears a blocker and introduces another", () => {
    const heavy: Design = { vehicleId: "small", powerId: "solar-large", commsId: "ka-band", instrumentIds: ["drill", "radar", "spectrometer", "seismometer"] };
    const [blockers] = of(designChanges(heavy, { ...heavy, commsId: null }), "mission_launch_blockers_changed");
    expect(blockers).toMatchObject({ added: "no-comms", ready: false });
    expect(blockers).toHaveProperty("cleared", expect.stringContaining("too-heavy"));
  });

  it("does not call removing a part a recovery of the limit it set", () => {
    const short: Design = { ...ready, commsId: "uhf", instrumentIds: ["spectrometer"] };
    const changes = designChanges(short, { ...short, commsId: null });
    expect(of(changes, "mission_limit_changed")).toEqual([]);
    expect(of(changes, "mission_launch_blockers_changed")[0]).toMatchObject({ added: "no-comms", ready: false });
  });
});
