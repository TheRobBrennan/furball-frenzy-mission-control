"use client";

import { openTrailer } from "./PromoSplash";

/** A plain button that plays the trailer again. */
export default function TrailerButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" data-testid="trailer-again" onClick={openTrailer} className={`font-bold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber ${className}`}>
      Watch the trailer again
    </button>
  );
}
