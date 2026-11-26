import { evaluate } from "./evaluate";
import type { Design, IssueCode } from "./types";

// What one edit to the design changed: which parts, which limits were crossed or recovered, and which
// launch blockers appeared or cleared. Pure, so analytics only has to send what comes back.

export type PartCategory = "launcher" | "instrument" | "power" | "comms";
export type Limit = "mass" | "budget" | "power" | "data";

export type DesignChange =
  | { event: "mission_part_changed"; category: PartCategory; action: "add" | "remove" | "replace"; from: string; to: string }
  | { event: "mission_limit_changed"; limit: Limit; direction: "exceeded" | "resolved"; blocks_launch: boolean }
  | { event: "mission_launch_blockers_changed"; added: string; cleared: string; remaining: string; ready: boolean };

const slots = [
  ["launcher", "vehicleId"],
  ["power", "powerId"],
  ["comms", "commsId"],
] as const;

// A limit only means something while the part that sets it is chosen, so removing that part is not a recovery.
const limits: { id: Limit; blocks: boolean; applies: (d: Design) => boolean }[] = [
  { id: "mass", blocks: true, applies: (d) => d.vehicleId !== null },
  { id: "budget", blocks: true, applies: () => true },
  { id: "power", blocks: false, applies: (d) => d.powerId !== null },
  { id: "data", blocks: false, applies: (d) => d.commsId !== null },
];

function partChanges(before: Design, after: Design): DesignChange[] {
  const changes: DesignChange[] = [];
  const part = (category: PartCategory, from: string, to: string) =>
    changes.push({ event: "mission_part_changed", category, action: !from ? "add" : !to ? "remove" : "replace", from, to });
  for (const [category, slot] of slots) {
    if (before[slot] !== after[slot]) part(category, before[slot] ?? "", after[slot] ?? "");
  }
  for (const id of before.instrumentIds) if (!after.instrumentIds.includes(id)) part("instrument", id, "");
  for (const id of after.instrumentIds) if (!before.instrumentIds.includes(id)) part("instrument", "", id);
  return changes;
}

export function designChanges(before: Design, after: Design): DesignChange[] {
  const changes = partChanges(before, after);
  if (changes.length === 0) return changes;
  const was = evaluate(before);
  const now = evaluate(after);
  const over = (e: typeof was, id: Limit) => e.gauges.find((g) => g.id === id)?.status === "over";
  for (const limit of limits) {
    if (over(was, limit.id) === over(now, limit.id)) continue;
    const exceeded = over(now, limit.id);
    if (!exceeded && !limit.applies(after)) continue;
    changes.push({ event: "mission_limit_changed", limit: limit.id, direction: exceeded ? "exceeded" : "resolved", blocks_launch: limit.blocks });
  }
  const codes = (e: typeof was): IssueCode[] => e.issues.map((i) => i.code);
  const added = codes(now).filter((c) => !codes(was).includes(c));
  const cleared = codes(was).filter((c) => !codes(now).includes(c));
  if (added.length || cleared.length) {
    changes.push({ event: "mission_launch_blockers_changed", added: added.join(","), cleared: cleared.join(","), remaining: codes(now).join(","), ready: now.canLaunch });
  }
  return changes;
}
