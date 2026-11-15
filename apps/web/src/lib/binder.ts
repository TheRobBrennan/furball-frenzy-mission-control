// The binder, the elephants' case file, starts closed so a visitor sees the cover and the footer and
// chooses to open it. These are the small pieces of that behavior that can be tested on their own.

/** The label on the case button: Open the first time, Reopen after it has been opened and closed again. */
export function caseLabel(closed: boolean, opened: boolean): string {
  if (!closed) return "Close the case";
  return opened ? "Reopen the case" : "Open the case";
}

// Section ids match the tab labels, for example #launch-sites for the Launch sites tab. These older ids
// were renamed on 2026-11-15, and links already shared with them keep working.
const LEGACY_IDS: Readonly<Record<string, string>> = {
  story: "the-brief",
  crew: "launch-sites",
  stories: "origin-stories",
};

/**
 * A link such as /#origin-stories arrives while the case is closed. Returns the section id to open the
 * case and scroll to, or null when the hash is empty, points at the cover or the footer (which are
 * already showing), or names nothing on the page. An older id resolves to its new one.
 */
export function hashTarget(hash: string, ids: readonly string[]): string | null {
  const raw = hash.replace(/^#/, "");
  const id = LEGACY_IDS[raw] ?? raw;
  if (!id || id === "top" || id === "footer") return null;
  return ids.includes(id) ? id : null;
}
