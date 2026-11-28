import LunarRover from "@/components/fleet/LunarRover";

/** A drawn space station over the Earth's edge, the sticker's backdrop. */
function Station() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
      <circle cx="50" cy="50" r="50" fill="#0b1230" />
      <path d="M 4,72 Q 50,56 96,72 A 50 50 0 0 1 4,72 Z" fill="#1d6fd0" />
      <path d="M 18,80 q 10,-7 20,-2 q 6,5 -6,8 q -12,2 -14,-6 Z M 60,76 q 12,-5 18,2 q -4,8 -14,5 Z" fill="#3fae6a" />
      {[[22, 22], [76, 18], [60, 12], [14, 46], [86, 44], [38, 12]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#fff" />
      ))}
      <g transform="rotate(-12 50 46)">
        <rect x="10" y="44.5" width="80" height="3" fill="#cfd6e4" />
        {[13, 23, 68, 78].map((x) => (
          <g key={x} fill="#e0aa40" stroke="#6b4e10" strokeWidth="0.7">
            <rect x={x} y="27" width="9" height="16" />
            <rect x={x} y="49" width="9" height="16" />
          </g>
        ))}
        <rect x="38" y="40" width="24" height="12" rx="6" fill="#e8edf6" stroke="#8d97a6" />
        <rect x="45" y="30" width="10" height="32" rx="5" fill="#cfd6e4" stroke="#8d97a6" />
      </g>
    </svg>
  );
}

/** "New!" over a space station, with the two elephants gleefully driving their rover in circles around it. */
export default function NewSticker({ className = "" }: { className?: string }) {
  return (
    // Clipped to a circle, so the spinning layer never widens the page.
    <span data-testid="new-sticker" className={`pointer-events-none relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl shadow-black/60 ${className}`}>
      <Station />
      <span className="relative text-xl font-black uppercase text-white [text-shadow:0_2px_4px_#000,0_0_8px_#ff7a1a]">New!</span>
      <span aria-hidden="true" className="new-orbit absolute inset-0">
        <span className="new-orbit-rider absolute left-1/2 top-[3px] -ml-[11px] block w-[22px] drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
          <LunarRover />
        </span>
      </span>
    </span>
  );
}
