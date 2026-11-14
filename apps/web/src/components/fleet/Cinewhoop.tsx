import Prop from "./Prop";

// Blades, the DJI Avata: a compact drone with its propellers tucked inside four round guards, so it
// can dart through tight spaces. Seen from above. An original drawing, no logos.
export default function Cinewhoop() {
  const ducts: [number, number][] = [[54, 56], [146, 56], [54, 146], [146, 146]];
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Blades, a compact drone with its propellers inside four round guards, seen from above" className="mx-auto h-full w-auto">
      <ellipse cx="100" cy="188" rx="52" ry="5" fill="#000" opacity="0.3" />
      <g className="fleet-body">
        <path d="M 54,56 L 146,146 M 146,56 L 54,146" stroke="#050816" strokeWidth="14" strokeLinecap="round" />
        <path d="M 54,56 L 146,146 M 146,56 L 54,146" stroke="#3a4150" strokeWidth="9" strokeLinecap="round" />
        {ducts.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="38" fill="none" stroke="#050816" strokeWidth="13" />
            <circle cx={x} cy={y} r="38" fill="none" stroke="#2b303a" strokeWidth="8" />
            <Prop cx={x} cy={y} r={29} blade="#161a22" />
          </g>
        ))}
        <rect x="80" y="76" width="40" height="64" rx="16" fill="#4a5262" stroke="#050816" strokeWidth="3" />
        <rect x="88" y="94" width="24" height="30" rx="8" fill="#2f3542" stroke="#050816" strokeWidth="2" />
        <circle cx="100" cy="76" r="10" fill="#161a22" stroke="#050816" strokeWidth="2.5" />
        <circle cx="100" cy="76" r="5" fill="#5db7ff" />
        <path d="M 86,134 H114" stroke="#fb5607" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
