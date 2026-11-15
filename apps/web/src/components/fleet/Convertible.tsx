import Wheel from "./Wheel";

// The convertible: a long, low, dark blue drop-top with a tan interior, silver wheels, and the roof
// folded away, from the reference photos. Piggy is at the wheel,
// proposed, he is the first to jump at a road trip. An original drawing, no plates, badges,
// logos, or backgrounds.
const BODY =
  "M 22,152 L 22,116 Q 22,98 38,94 L 70,92 L 218,96 L 240,94 L 272,102 L 340,112 Q 378,116 392,130 L 394,146 Q 394,152 386,152 Z";

export default function Convertible() {
  return (
    <svg viewBox="6 44 396 136" preserveAspectRatio="xMidYMax meet" role="img" aria-label="The convertible, a dark blue drop-top with Piggy at the wheel" className="h-full w-full">
      <defs>
        <clipPath id="conv-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="conv-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4a8f" />
          <stop offset="1" stopColor="#12224a" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="172" rx="186" ry="7" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* interior, seats and dash, behind the side of the car */}
        <path d="M 108,96 Q 108,76 124,76 Q 142,76 144,96 Z" fill="#d6b384" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 164,96 Q 162,72 182,72 Q 204,72 206,96 Z" fill="#e3c394" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 40,94 L 108,90 L 108,98 L 38,100 Z" fill="#12161f" />
        <path d="M 228,98 L 240,88 L 262,102 Z" fill="#4a3822" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        {/* Piggy, proposed: a pink pilot pig in a brown aviator cap and goggles */}
        <g transform="translate(0,-3)">
          <circle cx="190" cy="76" r="15" fill="#f4a6b8" stroke="#050816" strokeWidth="2" />
          <path d="M 178,70 Q 178,54 192,54 Q 206,55 206,68 Z" fill="#7a4a2a" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 196,68 q 4,-2 8,1" stroke="#3a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="199" cy="66" r="4" fill="#bfe6f7" stroke="#3a2a1a" strokeWidth="2" />
          <ellipse cx="203" cy="79" rx="6.5" ry="4.5" fill="#e98fa6" stroke="#050816" strokeWidth="1.5" />
          <circle cx="201.5" cy="79" r="1" fill="#050816" />
          <circle cx="205" cy="79" r="1" fill="#050816" />
          <path d="M 178,60 L 174,50 L 184,56 Z" fill="#f4a6b8" stroke="#050816" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        <path d={BODY} fill="url(#conv-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#conv-clip)">
          <circle cx="90" cy="142" r="35" fill="#050c1c" />
          <circle cx="306" cy="142" r="35" fill="#050c1c" />
          <rect x="20" y="140" width="380" height="14" fill="#0a1430" opacity="0.6" />
        </g>
        {/* windshield, steering wheel */}
        <path d="M 238,58 L 274,102 L 256,100 L 232,62 Z" fill="#bfe6f7" opacity="0.8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 220,92 q 8,-7 14,2" stroke="#050816" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* body lines, door handle, mirror */}
        <path d="M 28,114 Q 200,106 372,120" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        <path d="M 146,96 L 146,146 M 262,102 L 262,146" stroke="#0a1430" strokeWidth="2" />
        <rect x="154" y="104" width="14" height="4" rx="2" fill="#3b5aa0" />
        <path d="M 244,80 q 6,-4 10,0 l -2,8 l -8,0 z" fill="#1b3366" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        {/* lights and front end */}
        <path d="M 352,116 L 382,124 L 379,132 L 348,124 Z" fill="#ffcf70" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 388,132 L 394,134 L 394,148 L 386,146 Z" fill="#0a0f1c" />
        <rect x="22" y="100" width="7" height="13" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={90} cy={142} r={29} rim="#cfd6e0" spoke="#8d99ac" spokes={5} />
      <Wheel cx={306} cy={142} r={29} rim="#cfd6e0" spoke="#8d99ac" spokes={5} />
    </svg>
  );
}
