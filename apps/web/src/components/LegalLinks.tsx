"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const link = "inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

const withFooterCard = ["/", "/missions", "/parade/thanksgiving-2026"];

/**
 * The privacy and terms links. On the home page they sit inside the footer's own text (inline), and on every other page
 * they are the footer, set in the same small type so they read as part of it.
 */
export default function LegalLinks({ inline = false }: { inline?: boolean }) {
  const pathname = usePathname();
  // Pages with the footer card carry the links inside it, so the page-end copy steps aside there.
  if (!inline && withFooterCard.includes(pathname)) return null;
  const links = (
    <>
      <Link href="/privacy" className={link}>
        Privacy policy
      </Link>
      <span aria-hidden="true" className={inline ? "hidden" : "mx-2 text-white/30"}>
        &middot;
      </span>
      <Link href="/terms" className={link}>
        Terms of use
      </Link>
    </>
  );
  if (inline) return <nav aria-label="Legal" className="flex shrink-0 flex-wrap items-center gap-x-4 text-white/75">{links}</nav>;
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-10 pt-6 text-center font-mono text-xs text-white/50">
      <nav aria-label="Legal">{links}</nav>
    </footer>
  );
}
