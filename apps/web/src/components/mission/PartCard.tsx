type PartCardProps = {
  name: string;
  blurb: string;
  stats: string[];
  selected: boolean;
  onSelect: () => void;
};

/** A card the player taps to pick a part. Tap again to take it back. At least 44 px tall to tap. */
export default function PartCard({ name, blurb, stats, selected, onSelect }: PartCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-12 w-full flex-col gap-1 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
        selected ? "border-amber bg-amber/10" : "border-white/15 bg-white/5 hover:bg-white/10"
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-base font-bold text-white">{name}</span>
        <span aria-hidden="true" className={`font-mono text-xs ${selected ? "text-amber" : "text-white/40"}`}>
          {selected ? "PICKED" : "PICK"}
        </span>
      </span>
      <span className="text-sm text-white/75">{blurb}</span>
      <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.7rem] text-ice">
        {stats.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </span>
    </button>
  );
}
