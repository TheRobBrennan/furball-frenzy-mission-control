import Wheel from "./Wheel";

// Rufus, the 2016 Hyundai Tucson: black, rounded, and the family's go-to for every kind of trip. An original drawing, no badges or plates. The back runs long and tall like the real one,
// the roof carries almost to the tail, and the two doors sit mid-body with a small fixed rear pane.
const BODY =
  "M 70,150 L 70,116 L 71,88 Q 76,56 124,50 L 238,50 Q 250,50 256,57 L 286,94 L 344,102 Q 362,106 364,124 L 366,150 Z";

export default function Rufus() {
  return (
    <svg viewBox="56 36 322 144" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Rufus, a black Tucson SUV, the family's go-to for every kind of trip" className="h-full w-full">
      <defs>
        <clipPath id="rufus-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="rufus-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f4d" />
          <stop offset="1" stopColor="#0c0e14" />
        </linearGradient>
        <linearGradient id="rufus-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6f86" />
          <stop offset="1" stopColor="#1a2434" />
        </linearGradient>
      </defs>
      <ellipse cx="208" cy="174" rx="180" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        <path d={BODY} fill="url(#rufus-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#rufus-clip)">
          <circle cx="110" cy="146" r="34" fill="#030509" />
          <circle cx="298" cy="146" r="34" fill="#030509" />
          <rect x="66" y="140" width="304" height="12" fill="#8d97a6" />
        </g>
        <path d="M 92,82 Q 98,64 120,58 L 120,82 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 128,58 L 176,58 L 176,84 L 128,84 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 184,58 L 236,58 Q 245,58 250,63 L 266,84 L 184,84 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 124,47 L 242,47" stroke="#8d97a6" strokeWidth="3" strokeLinecap="round" />
        <path d="M 76,104 L 340,108" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 124,58 V112 M 181,58 V128 M 268,88 V126" stroke="#1a1d27" strokeWidth="2" />
        <rect x="140" y="98" width="14" height="4" rx="2" fill="#8d97a6" />
        <rect x="196" y="98" width="14" height="4" rx="2" fill="#8d97a6" />
        <path d="M 322,102 L 358,108 L 356,118 L 322,110 Z" fill="#ffe9a8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 342,118 L 364,122 L 365,140 L 340,138 Z" fill="#8d97a6" />
        <rect x="70" y="84" width="9" height="11" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={110} cy={146} r={29} rim="#cbd2dc" spoke="#7d8a9e" spokes={5} />
      <Wheel cx={298} cy={146} r={29} rim="#cbd2dc" spoke="#7d8a9e" spokes={5} />
    </svg>
  );
}
