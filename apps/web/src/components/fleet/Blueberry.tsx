import Wheel from "./Wheel";

// Blueberry, the 2003 Toyota Camry: a dark blue four-door sedan. An original drawing, no badges
// or plates.
const BODY =
  "M 30,146 L 30,118 Q 30,108 42,106 L 96,100 L 134,72 Q 142,66 154,66 L 238,66 Q 252,66 260,74 L 292,100 L 352,106 Q 372,110 376,128 L 378,146 Z";

export default function Blueberry() {
  return (
    <svg viewBox="14 52 380 128" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Blueberry, a dark blue Camry sedan" className="h-full w-full">
      <defs>
        <clipPath id="blueberry-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="blueberry-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c4a9a" />
          <stop offset="1" stopColor="#13234f" />
        </linearGradient>
        <linearGradient id="blueberry-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fc4de" />
          <stop offset="1" stopColor="#4d7c9e" />
        </linearGradient>
      </defs>
      <ellipse cx="204" cy="174" rx="180" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        <path d={BODY} fill="url(#blueberry-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#blueberry-clip)">
          <circle cx="92" cy="146" r="33" fill="#050c1c" />
          <circle cx="306" cy="146" r="33" fill="#050c1c" />
          <rect x="26" y="138" width="356" height="10" fill="#0a1430" opacity="0.7" />
        </g>
        {/* the glass, front and rear doors */}
        <path d="M 112,98 L 142,76 L 196,75 L 196,98 Z" fill="url(#blueberry-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 203,75 L 240,75 Q 248,75 254,81 L 280,98 L 203,98 Z" fill="url(#blueberry-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 118,96 L 140,80 L 150,80 L 130,96 Z" fill="#fff" opacity="0.25" />
        <path d="M 34,120 L 374,128" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        <path d="M 199,76 V134 M 124,102 L 122,134" stroke="#0a1430" strokeWidth="2" />
        <rect x="170" y="108" width="14" height="4" rx="2" fill="#3b5aa0" />
        <rect x="216" y="108" width="14" height="4" rx="2" fill="#3b5aa0" />
        <path d="M 360,110 L 376,116 L 374,124 L 358,119 Z" fill="#ffe9a8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <rect x="30" y="112" width="6" height="12" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={92} cy={146} r={26} rim="#d7dde6" spoke="#9aa8ba" />
      <Wheel cx={306} cy={146} r={26} rim="#d7dde6" spoke="#9aa8ba" />
    </svg>
  );
}
