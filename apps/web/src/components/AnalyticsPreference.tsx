"use client";

import { useSyncExternalStore } from "react";
import { optedOut, setAnalyticsEnabled, subscribeToAnalyticsPreference } from "@/lib/analytics";

export default function AnalyticsPreference() {
  const isOff = useSyncExternalStore(subscribeToAnalyticsPreference, optedOut, () => null);

  return (
    <button
      type="button"
      role="switch"
      aria-label="Analytics"
      aria-checked={isOff === false}
      disabled={isOff === null}
      onClick={() => setAnalyticsEnabled(isOff === true)}
      className="inline-flex min-h-11 items-center rounded-lg border border-amber px-4 font-semibold text-amber focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {isOff === null ? "Analytics preference" : isOff ? "Analytics off" : "Analytics on"}
    </button>
  );
}
