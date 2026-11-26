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
    <div
      data-testid="version-line"
      className="mx-auto mt-4 max-w-xs overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left"
    >
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="View the repository on GitHub"
        className="flex min-h-11 items-center justify-between gap-3 p-3 hover:bg-white/5"
      >
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-white/80">Furball Frenzy</span>
          <span className="block text-white/50">Mission Control on GitHub</span>
        </span>
        <span aria-hidden="true">&#8599;</span>
      </a>
      <div className="space-y-1 border-t border-white/10 px-3 py-2.5 text-[11px] leading-tight text-white/50">
        <p>
          v{version}
          {gitHash && (
            <>
              {" "}
              &middot;{" "}
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
        </p>
        {deployed && <p>Released {deployed}</p>}
      </div>
    </div>
  );
}
