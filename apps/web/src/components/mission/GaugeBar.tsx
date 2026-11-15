import type { Gauge } from "@/lib/mission";

const colors = { ok: "bg-emerald-400", tight: "bg-amber", over: "bg-rose-500" } as const;
const words = { ok: "OK", tight: "Tight", over: "Over" } as const;

/**
 * One of the six gauges. A gauge with no limit yet, such as mass before a launcher is picked, stays empty.
 * The compact form shows only the label and the bar, for the strip that stays on screen on a phone.
 */
export default function GaugeBar({ gauge, compact = false }: { gauge: Gauge; compact?: boolean }) {
  const { id, label, unit, used, limit, status } = gauge;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const text = limit > 0 ? `${Math.round(used)} of ${Math.round(limit)} ${unit}` : `${Math.round(used)} ${unit}`;
  return (
    <div data-testid={compact ? `gauge-compact-${id}` : `gauge-${id}`} data-status={status}>
      <div className="flex items-baseline justify-between gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-white/70">
        <span>{label}</span>
        {!compact && <span className={status === "over" ? "text-rose-300" : "text-white/70"}>{text}</span>}
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.max(limit, 1)}
        aria-valuenow={Math.min(used, Math.max(limit, 1))}
        aria-valuetext={`${text}, ${words[status]}`}
        className={`overflow-hidden rounded-full bg-white/10 ${compact ? "mt-0.5 h-1.5" : "mt-1 h-2"}`}
      >
        <div className={`h-full rounded-full transition-[width] duration-300 ${colors[status]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
