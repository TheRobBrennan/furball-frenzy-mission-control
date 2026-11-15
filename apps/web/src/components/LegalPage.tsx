import Link from "next/link";
import type { ReactNode } from "react";

/** The shared frame for the privacy and terms pages: a way back, a title, the date, and readable text. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main id="top" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-ice underline-offset-4 hover:underline">
        &larr; Mission Control
      </Link>
      <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">{title}</h1>
      <p className="mt-2 font-mono text-xs text-white/60">Last updated {updated}</p>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-white/85 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-white [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">{children}</div>
    </main>
  );
}
