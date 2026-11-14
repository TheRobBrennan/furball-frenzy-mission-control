"use client";

import { useEffect, useState } from "react";

type Status =
  | { state: "checking" }
  | { state: "online"; crew: number }
  | { state: "offline" };

// A tiny proof that the web app and the FastAPI backend are talking.
export default function MissionStatus() {
  const [status, setStatus] = useState<Status>({ state: "checking" });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const health = await fetch("/api/health");
        if (!health.ok) throw new Error("health check failed");
        const crew = (await (await fetch("/api/crew")).json()) as unknown[];
        if (!cancelled) setStatus({ state: "online", crew: crew.length });
      } catch {
        if (!cancelled) setStatus({ state: "offline" });
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    status.state === "checking"
      ? "Contacting Mission Control..."
      : status.state === "online"
        ? `Mission Control online, ${status.crew} furballs on the roster`
        : "Mission Control is offline, the crew is still packing";

  const dot =
    status.state === "online"
      ? "bg-emerald-400"
      : status.state === "offline"
        ? "bg-ember"
        : "bg-amber animate-pulse";

  return (
    <p
      className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-sm"
      role="status"
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </p>
  );
}
