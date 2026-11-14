import Prop from "./Prop";

// Blurr, the DJI FPV: a fast, long-bodied drone with a camera up front and the battery on its back,
// seen from above. An original drawing, no logos.
export default function FpvDrone() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Blurr, a fast long-bodied drone with a camera in front and a battery on its back, seen from above" className="mx-auto h-full w-auto">
      <ellipse cx="100" cy="190" rx="56" ry="5" fill="#000" opacity="0.3" />
      <g className="fleet-body">
        <path d="M 92,78 L 36,36 M 108,78 L 164,36 M 92,128 L 34,160 M 108,128 L 166,160" stroke="#050816" strokeWidth="13" strokeLinecap="round" />
        <path d="M 92,78 L 36,36 M 108,78 L 164,36 M 92,128 L 34,160 M 108,128 L 166,160" stroke="#2f3542" strokeWidth="8" strokeLinecap="round" />
        <Prop cx={36} cy={36} r={30} blade="#161a22" />
        <Prop cx={164} cy={36} r={30} blade="#161a22" />
        <Prop cx={34} cy={160} r={30} blade="#161a22" />
        <Prop cx={166} cy={160} r={30} blade="#161a22" />
        <path d="M 100,52 L 120,84 L 118,150 Q 118,160 108,160 L 92,160 Q 82,160 82,150 L 80,84 Z" fill="#3a4150" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <rect x="88" y="98" width="24" height="44" rx="7" fill="#aab3c0" stroke="#050816" strokeWidth="2.5" />
        <path d="M 92,106 H108 M 92,114 H108" stroke="#6c7686" strokeWidth="2" />
        <circle cx="100" cy="64" r="8" fill="#161a22" stroke="#050816" strokeWidth="2.5" />
        <circle cx="100" cy="64" r="3.6" fill="#5db7ff" />
        <path d="M 96,160 L 90,176 M 104,160 L 110,176" stroke="#fb5607" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
