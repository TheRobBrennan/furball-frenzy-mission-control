/** The slide switch for sound, shared by the settings menu and the parade. */
export default function SoundSwitch({ on, onToggle, className = "", compact = false }: { on: boolean; onToggle: () => void; className?: string; compact?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} data-no-fireworks onClick={onToggle} className={`inline-flex min-h-11 items-center ${compact ? "gap-1 sm:gap-3" : "gap-3"} font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber ${className}`}>
      {compact && (
        <span aria-hidden="true" className="hidden text-lg min-[360px]:inline sm:!hidden">
          🔊
        </span>
      )}
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>Sound</span>
      <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-amber" : "bg-white/25"}`}>
        <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}
