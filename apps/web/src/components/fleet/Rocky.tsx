import Wheel from "./Wheel";

// Rocky, the big blue truck: an extended cab with a flat tonneau cover over the bed and side
// steps. An original drawing, no plates, badges, logos, or backgrounds.
const BODY =
  "M 24,152 L 24,104 Q 24,98 31,98 L 176,98 L 182,70 Q 184,62 194,62 L 252,62 Q 262,62 267,70 L 296,104 L 376,112 Q 392,114 394,130 L 396,146 Q 396,152 388,152 Z";

export default function Rocky() {
  return (
    <svg viewBox="6 52 396 128" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Rocky, a big blue pickup truck with a covered bed" className="h-full w-full">
      <defs>
        <clipPath id="rocky-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="rocky-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6f7" />
          <stop offset="1" stopColor="#5aa0c8" />
        </linearGradient>
        <linearGradient id="rocky-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b97ec" />
          <stop offset="1" stopColor="#1769c0" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="172" rx="186" ry="7" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        <path d={BODY} fill="url(#rocky-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#rocky-clip)">
          <circle cx="96" cy="142" r="35" fill="#07162e" />
          <circle cx="306" cy="142" r="35" fill="#07162e" />
          <rect x="20" y="140" width="380" height="14" fill="#0e4c93" opacity="0.55" />
        </g>
        {/* tonneau cover over the bed */}
        <path d="M 28,100 L 174,100 L 174,110 L 28,110 Z" fill="#2c86df" stroke="#0e4c93" strokeWidth="1.5" />
        <path d="M 64,100 V110 M 104,100 V110 M 144,100 V110" stroke="#0e4c93" strokeWidth="1.5" />
        {/* cab windows */}
        <path d="M 188,70 L 208,70 L 208,97 L 185,97 Z" fill="url(#rocky-glass)" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 215,70 L 252,70 Q 258,70 262,76 L 285,97 L 215,97 Z" fill="url(#rocky-glass)" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 222,76 L 238,76 L 226,90 Z" fill="#fff" opacity="0.35" />
        {/* shoulder line, door seams, handle, mirror */}
        <path d="M 26,118 L 372,126" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 211,70 V148 M 289,104 L 286,148" stroke="#0e4c93" strokeWidth="2" />
        <rect x="262" y="112" width="15" height="4" rx="2" fill="#0e4c93" />
        <path d="M 268,98 q 7,-5 12,0 l -2,9 l -9,0 z" fill="#1d78d6" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        {/* side step */}
        <rect x="206" y="150" width="86" height="6" rx="3" fill="#0a0f1c" />
        {/* lights and front end */}
        <path d="M 372,114 L 390,119 L 388,129 L 370,125 Z" fill="#fff6c8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 386,130 L 396,132 L 396,146 L 386,144 Z" fill="#0a0f1c" />
        <path d="M 368,145 L 397,145 L 397,153 L 362,153 Z" fill="#0a0f1c" />
        <rect x="24" y="106" width="6" height="14" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={96} cy={142} r={28} rim="#cfd8e3" spoke="#8ea0b4" />
      <Wheel cx={306} cy={142} r={28} rim="#cfd8e3" spoke="#8ea0b4" />
    </svg>
  );
}
