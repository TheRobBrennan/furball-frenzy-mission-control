import Link from "next/link";

/** The privacy and terms links, in the footer of every page. */
export default function LegalLinks() {
  return (
    <nav aria-label="Legal" className="mx-auto flex w-full max-w-5xl justify-center gap-6 px-6 pb-8 font-mono text-xs text-white/60">
      <Link href="/privacy" className="underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber">
        Privacy
      </Link>
      <Link href="/terms" className="underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber">
        Terms
      </Link>
    </nav>
  );
}
