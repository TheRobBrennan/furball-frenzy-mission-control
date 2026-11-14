import Wheel from "./Wheel";

// Watson, the 2025 Hyundai Tucson: a sharp-edged compact SUV in dark metallic gray with a light bar across the front. An original drawing, no badges or plates. The back runs long and tall like the real one,
// the roof carries almost to the tail, and the two doors sit mid-body with a small fixed rear pane.
const BODY =
  "M 70,150 L 70,112 L 70,68 L 76,54 L 92,50 L 236,50 Q 246,50 252,56 L 286,94 L 344,102 Q 362,106 364,124 L 366,150 Z";

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
          <circle cx="110" cy="146" r="34" fill="#030509" />
          <circle cx="298" cy="146" r="34" fill="#030509" />
          <rect x="66" y="140" width="304" height="12" fill="#aeb8c6" />
        </g>
        <path d="M 98,82 L 100,64 Q 102,59 112,58 L 120,58 L 120,82 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 128,58 L 176,58 L 176,84 L 128,84 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 184,58 L 236,58 Q 245,58 250,63 L 266,84 L 184,84 Z" fill="url(#watson-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 76,104 L 340,108" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 124,58 V112 M 181,58 V128 M 268,88 V126" stroke="#1a1d27" strokeWidth="2" />
        <rect x="140" y="98" width="14" height="4" rx="2" fill="#2a3140" />
        <rect x="196" y="98" width="14" height="4" rx="2" fill="#2a3140" />
        <path d="M 322,100 L 360,106 L 359,111 L 322,105 Z" fill="#e8f6ff" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 346,112 L 364,118 L 365,140 L 344,136 Z" fill="#0a0f1c" />
        <rect x="70" y="76" width="9" height="11" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={110} cy={146} r={29} rim="#1c2230" spoke="#6d7a90" spokes={5} />
      <Wheel cx={298} cy={146} r={29} rim="#1c2230" spoke="#6d7a90" spokes={5} />
    </svg>
  );
}
