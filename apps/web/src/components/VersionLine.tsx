"use client";

import { useEffect, useState } from "react";
import { REPO_URL, getVersionInfo } from "@/lib/version";

// Formats the release (deploy) time in the visitor's own time zone, for example "2026.11.14 @ 4:45 PM EST".
// It runs after hydration so the server and the browser never disagree about the zone.
function formatDeployTime(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")} @ ${get("hour")}:${get("minute")} ${get("dayPeriod")} ${get("timeZoneName")}`;
}

export default function VersionLine() {
  const { version, gitHash, deployedAt } = getVersionInfo();
  const [deployed, setDeployed] = useState<string | null>(null);

  useEffect(() => {
    // Formatting needs the browser's time zone, so it can only happen after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (deployedAt) setDeployed(formatDeployTime(deployedAt));
  }, [deployedAt]);

  return (
    <p
      data-testid="version-line"
      className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-white/40"
    >
      <span>v{version}</span>
      {gitHash && (
        <>
          <span aria-hidden="true">&middot;</span>
          <a
            href={`${REPO_URL}/commit/${gitHash}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View this commit on GitHub"
            className="underline decoration-white/20 underline-offset-2 hover:text-white/70"
          >
            {gitHash.slice(0, 7)}
          </a>
        </>
      )}
      {deployed && (
        <>
          <span aria-hidden="true" className="hidden sm:inline">
            &middot;
          </span>
          <span className="basis-full sm:basis-auto">Released {deployed}</span>
        </>
      )}
    </p>
  );
}
