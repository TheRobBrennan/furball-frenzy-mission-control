"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const link = "underline decoration-1 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

/**
 * The privacy and terms links. On the home page they sit inside the footer's own text (inline), and on every other page
 * they are the footer, set in the same small type so they read as part of it.
 */
export default function LegalLinks({ inline = false }: { inline?: boolean }) {
  const pathname = usePathname();
  // The home page puts its own inline links in its footer, so the page-end copy steps aside there.
  if (!inline && pathname === "/") return null;
  const links = (
    <>
      <Link href="/privacy" className={link}>
        Privacy
      </Link>
      <span aria-hidden="true" className="mx-2 text-white/30">
        &middot;
      </span>
      <Link href="/terms" className={link}>
        Terms
      </Link>
    </>
  );
  if (inline) return <nav aria-label="Legal" className="mt-1 block">{links}</nav>;
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-10 pt-6 text-center font-mono text-xs text-white/50">
      <nav aria-label="Legal">{links}</nav>
    </footer>
  );
}
