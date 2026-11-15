// The email sign-up for folks who want to stay updated on the Furball Frenzy and the adventures of the Polish elephants and family.
// It is a Flodesk form that appears inside the page. No email address touches this site, and Flodesk's script is loaded only
// after a visitor asks to sign up, so merely visiting the site sends nothing to Flodesk.

/** The Flodesk form id, public by design, from the form's embed code. NEXT_PUBLIC_FLODESK_FORM_ID overrides it, and "none" turns the box off. */
export const FLODESK_FORM_ID = "6afa20d07c61c44f4b4fe6cc";

export function formId(raw: string | undefined = process.env.NEXT_PUBLIC_FLODESK_FORM_ID): string | null {
  const id = (raw ?? "").trim() || FLODESK_FORM_ID;
  return id === "none" || !/^[a-z0-9]{12,40}$/i.test(id) ? null : id;
}

export const FLODESK_ASSETS = "https://assets.flodesk.com";
type FlodeskWindow = Window & { FlodeskObject?: string; fd?: ((...args: unknown[]) => void) & { q?: unknown[][] } };

/** Loads Flodesk's universal script once, the same loader as Flodesk's own header snippet, then everything queued on fd runs. */
export function loadFlodesk(doc: Document = document, win: FlodeskWindow = window as FlodeskWindow): void {
  if (win.fd) return;
  win.FlodeskObject = "fd";
  const queue = (...args: unknown[]) => {
    (queue.q = queue.q || []).push(args);
  };
  queue.q = [] as unknown[][];
  win.fd = queue;
  const version = `?v=${Math.floor(Date.now() / (120 * 1000)) * 60}`;
  for (const [ext, attr] of [["mjs", "module"], ["js", "nomodule"]] as const) {
    const s = doc.createElement("script");
    s.async = true;
    if (attr === "module") s.type = "module";
    else s.noModule = true;
    s.src = `${FLODESK_ASSETS}/universal.${ext}${version}`;
    doc.head.appendChild(s);
  }
}

/** Shows the Flodesk form with the given id inside the element with the given container id. */
export function showForm(id: string, containerId: string, win: FlodeskWindow = window as FlodeskWindow): void {
  loadFlodesk(win.document, win);
  win.fd?.("form", { formId: id, containerEl: `#${containerId}` });
}
