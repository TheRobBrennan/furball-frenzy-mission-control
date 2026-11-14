import Prop from "./Prop";

// B, the DJI Mini 2 Pro: a small, light gray folding drone, seen from above, camera forward. The
// newest member of the family. An original drawing, no logos.
export default function MiniDrone() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="B, a small light gray folding drone seen from above" className="mx-auto h-full w-auto">
      <ellipse cx="100" cy="188" rx="46" ry="5" fill="#000" opacity="0.3" />
      <g className="fleet-body">
        <path d="M 92,92 L 52,56 M 108,92 L 148,56 M 92,112 L 54,146 M 108,112 L 146,146" stroke="#050816" strokeWidth="13" strokeLinecap="round" />
        <path d="M 92,92 L 52,56 M 108,92 L 148,56 M 92,112 L 54,146 M 108,112 L 146,146" stroke="#e4e7eb" strokeWidth="8" strokeLinecap="round" />
        <Prop cx={52} cy={56} r={32} />
        <Prop cx={148} cy={56} r={32} />
        <Prop cx={54} cy={146} r={32} />
        <Prop cx={146} cy={146} r={32} />
        <rect x="82" y="78" width="36" height="58" rx="16" fill="#e4e7eb" stroke="#050816" strokeWidth="3" />
        <rect x="90" y="94" width="20" height="28" rx="8" fill="#c3c9d2" stroke="#050816" strokeWidth="2" />
        <circle cx="100" cy="76" r="9" fill="#2b303a" stroke="#050816" strokeWidth="2.5" />
        <circle cx="100" cy="76" r="4" fill="#5db7ff" />
        <circle cx="100" cy="132" r="2.4" fill="#2dd4bf" />
      </g>
    </svg>
  );
}
