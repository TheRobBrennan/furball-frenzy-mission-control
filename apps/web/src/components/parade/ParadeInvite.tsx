import Link from "next/link";

/** The way in to Parade Day from the home page. It names the treat without showing any balloons. */
export default function ParadeInvite({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/missions/parade/thanksgiving-2026"
      data-testid="parade-invite"
      className={`min-h-16 max-w-md items-center gap-3 rounded-2xl border-2 border-amber bg-amber/10 px-4 py-3 text-left transition hover:bg-amber/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <span aria-hidden="true" className="parade-invite-icon text-3xl">
        🎈
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-amber">New: A special treat</span>
        <span className="block text-balance text-base font-black text-white sm:text-lg">The first annual Furball Frenzy Thanksgiving parade &rarr;</span>
      </span>
    </Link>
  );
}
