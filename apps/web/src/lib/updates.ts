// The email sign-up for folks who want to stay updated on the Furball Frenzy and the adventures of the Polish elephants and family.
// It is a link to a Flodesk hosted form, so no email address ever touches this site. With no link set, nothing shows.

/** The Flodesk form link, or null when it is not set or is not an https link on flodesk.com. */
export function signupUrl(raw: string | undefined = process.env.NEXT_PUBLIC_FLODESK_FORM_URL): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const ok = url.protocol === "https:" && (url.hostname === "flodesk.com" || url.hostname.endsWith(".flodesk.com"));
    return ok ? url.toString() : null;
  } catch {
    return null;
  }
}
