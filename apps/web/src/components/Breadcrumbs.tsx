import Link from "next/link";

/** Where this page sits, with the way back to Missions. */
export default function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-white/65">
        <li>
          <Link href="/missions" className="inline-flex min-h-11 items-center font-semibold text-amber underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-amber">
            Missions
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
