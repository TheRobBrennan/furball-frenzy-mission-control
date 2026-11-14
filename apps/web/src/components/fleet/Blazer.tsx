import Wheel from "./Wheel";

// The Blazer: a sporty blue crossover with black trim, black wheels, and a long sloping roof. An
// original drawing, no plates, badges, logos, or backgrounds.
const BODY =
  "M 60,152 L 60,110 Q 60,100 68,95 L 88,78 Q 98,52 116,50 L 244,48 Q 258,48 266,58 L 304,100 L 348,108 Q 364,112 368,130 L 370,148 Q 370,152 364,152 Z";

export default function Blazer() {
  return (
    <svg viewBox="40 36 350 140" preserveAspectRatio="xMidYMax meet" role="img" aria-label="The Blazer, a sporty blue crossover with black wheels" className="h-full w-full">
      <defs>
        <clipPath id="blazer-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="blazer-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c6a96" />
          <stop offset="1" stopColor="#1b2b45" />
        </linearGradient>
        <linearGradient id="blazer-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35a0f5" />
          <stop offset="1" stopColor="#1572cf" />
        </linearGradient>
      </defs>
      <ellipse cx="215" cy="172" rx="170" ry="7" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* roof rails */}
        <path d="M 112,43 L 244,41" stroke="#0a0f1c" strokeWidth="4" strokeLinecap="round" />
        <path d="M 128,43 V50 M 228,41 V48" stroke="#0a0f1c" strokeWidth="3" />
        <path d={BODY} fill="url(#blazer-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#blazer-clip)">
          {/* black lower cladding and wheel arches */}
          <rect x="56" y="128" width="320" height="26" fill="#0a0f1c" />
          <circle cx="112" cy="142" r="36" fill="#05080f" />
          <circle cx="312" cy="142" r="36" fill="#05080f" />
        </g>
        {/* tinted windows: a small fixed quarter glass, the mid door, and the front door */}
        <path d="M 102,66 L 124,64 L 124,92 L 94,92 Z" fill="url(#blazer-glass)" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 131,64 L 186,63 L 186,92 L 131,92 Z" fill="url(#blazer-glass)" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 194,63 L 240,61 Q 248,61 252,67 L 284,92 L 194,92 Z" fill="url(#blazer-glass)" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 200,69 L 216,69 L 204,84 Z" fill="#fff" opacity="0.22" />
        {/* shoulder line, door seams, handles: the mid door, then the front door */}
        <path d="M 64,118 L 350,124" stroke="#fff" strokeOpacity="0.32" strokeWidth="2" strokeLinecap="round" />
        <path d="M 127,64 V128 M 190,63 V128 M 268,100 L 264,128" stroke="#0e4c93" strokeWidth="2" />
        <rect x="170" y="100" width="14" height="4" rx="2" fill="#0e4c93" />
        <rect x="244" y="100" width="14" height="4" rx="2" fill="#0e4c93" />
        <path d="M 258,92 q 7,-5 12,0 l -2,9 l -9,0 z" fill="#1d78d6" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        {/* lights and front end */}
        <path d="M 338,110 L 362,117 L 361,123 L 336,117 Z" fill="#fff6c8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 358,124 L 370,130 L 370,148 L 352,142 Z" fill="#05080f" />
        <circle cx="344" cy="138" r="4" fill="#ffe9a8" />
        <rect x="60" y="104" width="8" height="6" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={112} cy={142} r={30} rim="#161b29" spoke="#4a5672" spokes={10} />
      <Wheel cx={312} cy={142} r={30} rim="#161b29" spoke="#4a5672" spokes={10} />
    </svg>
  );
}
