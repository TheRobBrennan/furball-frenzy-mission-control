import type { Design } from "./types";

// Small pure helpers for changing a design, so the screen stays simple and these can be tested alone.

export const emptyDesign: Design = { instrumentIds: [], powerId: null, commsId: null, vehicleId: null };

export type Slot = "powerId" | "commsId" | "vehicleId";

/** Adds an instrument, or takes it out if it is already chosen. Order follows the order picked. */
export function toggleInstrument(design: Design, id: string): Design {
  const has = design.instrumentIds.includes(id);
  return { ...design, instrumentIds: has ? design.instrumentIds.filter((i) => i !== id) : [...design.instrumentIds, id] };
}

/** Chooses the one power part, antenna, or launcher for a slot, and picking the same one again clears it. */
export function choose(design: Design, slot: Slot, id: string): Design {
  return { ...design, [slot]: design[slot] === id ? null : id };
}
