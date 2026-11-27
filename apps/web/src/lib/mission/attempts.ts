// How one launch connects to the one before it, so a report can compare a first mission with the next.
// Kept per mode in browser memory, nothing here is saved.

export type Via = "first" | "unchanged" | "revision" | "reset";

export type Attempt = { attempt: number; debriefSeen: boolean; next: Exclude<Via, "first"> };

export function attemptLink(previous: Attempt | undefined) {
  return {
    previous_attempt: previous?.attempt ?? 0,
    previous_debrief_seen: previous?.debriefSeen ?? false,
    via: previous?.next ?? ("first" as Via),
  };
}

export const nextAttempt = (previous: Attempt | undefined): Attempt => ({ attempt: (previous?.attempt ?? 0) + 1, debriefSeen: false, next: "unchanged" });
