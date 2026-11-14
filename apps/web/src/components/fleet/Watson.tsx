import Wheel from "./Wheel";

// Watson, the 2025 Hyundai Tucson: a sharp-edged compact SUV in dark metallic gray, with a flat
// roof, a tall tail, and a light bar across the front. An original drawing, no badges or plates.
const BODY =
  "M 70,150 L 70,112 Q 70,102 80,98 L 112,90 L 130,62 Q 138,50 152,50 L 250,50 Q 262,50 270,58 L 300,96 L 344,102 Q 362,106 364,124 L 366,150 Z";

export default function Watson() {
  return (
    <svg viewBox="56 36 322 144" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Watson, a dark gray Tucson SUV with sharp angles" className="h-full w-full">
      <defs>
        <clipPath id="watson-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="watson-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7b8798" />
          <stop offset="1" stopColor="#3f4858" />
        </linearGradient>
        <linearGradient id="watson-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e8299" />
          <stop offset="1" stopColor="#1c2738" />
        </linearGradient>
      </defs>
      <ellipse cx="208" cy="174" rx="180" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        <path d={BODY} fill="url(#watson-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#watson-clip)">
          <circle cx="128" cy="146" r="34" fill="#05080f" />
          <circle cx="302" cy="146" r="34" fill="#05080f" />
          {/* silver lower trim */}
          <rect x="66" y="138" width="304" height="14" fill="#aeb8c6" />
        </g>
        {/* tinted glass: a small fixed rear quarter pane, the mid door, the front door, no rear door */}
        <path d="M 124,90 L 136,68 L 152,66 L 152,90 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 171,62 L 216,62 L 216,90 L 171,90 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 223,62 L 246,62 Q 252,62 256,67 L 284,90 L 223,90 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* sharp creases and the door seams */}
        <path d="M 76,112 L 340,108" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        <path d="M 167,62 V136 M 219,62 V136" stroke="#2a3140" strokeWidth="2" />
        <rect x="192" y="100" width="14" height="4" rx="2" fill="#2a3140" />
        <rect x="234" y="100" width="14" height="4" rx="2" fill="#2a3140" />
        {/* the front: a hidden light bar and a headlight, the grille */}
        <path d="M 322,100 L 360,106 L 359,111 L 322,105 Z" fill="#e8f6ff" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 346,112 L 364,118 L 365,140 L 344,136 Z" fill="#0a0f1c" />
        <rect x="70" y="106" width="12" height="5" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={128} cy={146} r={29} rim="#1c2230" spoke="#6d7a90" spokes={5} />
      <Wheel cx={302} cy={146} r={29} rim="#1c2230" spoke="#6d7a90" spokes={5} />
    </svg>
  );
}
