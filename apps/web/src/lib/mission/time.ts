// Mission transcripts stamp every message with UTC, the clock all space communication is logged in, and
// with the local time too, so the crew and the visitor can both place it.

export type Stamp = { utc: string; local: string; iso: string };

/** Formats a moment for the transcript. The time zone is only passed in tests, otherwise it is the visitor's own. */
export function formatStamp(date: Date, timeZone?: string): Stamp {
  const utc = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" }).format(date);
  const local = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", timeZoneName: "short", timeZone }).format(date);
  return { utc: `${utc} UTC`, local, iso: date.toISOString() };
}
