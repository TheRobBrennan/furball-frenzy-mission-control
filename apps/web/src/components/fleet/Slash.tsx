import Wheel from "./Wheel";

// Slash, the Traxxas 1/10 scale 2WD short-course truck: a low flared body, a roll-cage cab, a black
// bumper, and big knobbly tires. Rocky is its full-size version. An original drawing, blue as a
// proposal until Rob confirms the color, no logos.
const BODY =
  "M 66,140 L 66,116 Q 66,108 76,106 L 146,102 L 168,84 Q 174,78 184,78 L 230,78 Q 240,78 246,86 L 262,102 L 332,108 Q 352,112 356,128 L 358,140 Z";

export default function Slash() {
  return (
    <svg viewBox="30 62 360 124" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Slash, a blue radio control short-course truck with big knobbly tires" className="h-full w-full">
      <defs>
        <clipPath id="slash-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="slash-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="174" rx="170" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        <path d={BODY} fill="url(#slash-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#slash-clip)">
          <circle cx="112" cy="140" r="42" fill="#0b1226" />
          <circle cx="300" cy="142" r="38" fill="#0b1226" />
          {/* the white and black swoosh down the side */}
          <path d="M 70,126 Q 150,100 250,118 Q 300,126 358,116 L 358,128 Q 300,138 250,130 Q 150,114 70,140 Z" fill="#f1f5ff" />
          <path d="M 70,134 Q 150,112 250,126 Q 300,132 358,124 L 358,130 Q 300,138 250,134 Q 150,122 70,140 Z" fill="#0a0f1c" />
        </g>
        {/* the cab, with its roll cage */}
        <path d="M 176,86 L 232,86 L 254,102 L 170,102 Z" fill="#0f172a" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 192,86 V102 M 214,86 V102 M 176,94 H248" stroke="#e2e8f0" strokeWidth="2.5" />
        {/* the black front end and the headlight */}
        <path d="M 338,112 L 358,118 L 358,140 L 336,140 Z" fill="#0a0f1c" />
        <path d="M 330,110 L 348,114 L 346,122 L 330,118 Z" fill="#fff6c8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <rect x="66" y="112" width="6" height="12" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={112} cy={140} r={34} rim="#161b29" spoke="#4a5672" spokes={6} knobs={14} />
      <Wheel cx={300} cy={142} r={30} rim="#161b29" spoke="#4a5672" spokes={6} knobs={12} />
    </svg>
  );
}
