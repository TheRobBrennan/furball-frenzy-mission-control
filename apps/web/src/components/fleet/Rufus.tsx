import Wheel from "./Wheel";

// Rufus, the 2016 Hyundai Tucson: black, rounded, and the family's go-to for every kind of trip.
// An original drawing, no badges or plates.
const BODY =
  "M 70,150 L 70,114 Q 70,102 82,98 L 118,90 Q 126,56 152,52 L 248,52 Q 266,52 276,62 L 304,98 L 342,104 Q 362,108 364,126 L 366,150 Z";

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
          <circle cx="128" cy="146" r="34" fill="#030509" />
          <circle cx="302" cy="146" r="34" fill="#030509" />
          <rect x="66" y="140" width="304" height="12" fill="#8d97a6" />
        </g>
        <path d="M 124,90 Q 130,66 152,64 L 164,64 L 164,90 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 171,64 L 216,64 L 216,90 L 171,90 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 223,64 L 248,64 Q 256,64 262,70 L 288,90 L 223,90 Z" fill="url(#rufus-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* roof rails, a soft shoulder line, the door seams */}
        <path d="M 140,47 L 252,47" stroke="#8d97a6" strokeWidth="3" strokeLinecap="round" />
        <path d="M 76,114 Q 200,104 342,112" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 167,64 V138 M 219,64 V138" stroke="#1a1d27" strokeWidth="2" />
        <rect x="192" y="100" width="14" height="4" rx="2" fill="#8d97a6" />
        <rect x="140" y="100" width="14" height="4" rx="2" fill="#8d97a6" />
        <path d="M 322,102 L 358,108 L 356,118 L 322,110 Z" fill="#ffe9a8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 342,118 L 364,122 L 365,140 L 340,138 Z" fill="#8d97a6" />
        <rect x="70" y="108" width="10" height="6" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={128} cy={146} r={29} rim="#cbd2dc" spoke="#7d8a9e" spokes={5} />
      <Wheel cx={302} cy={146} r={29} rim="#cbd2dc" spoke="#7d8a9e" spokes={5} />
    </svg>
  );
}
