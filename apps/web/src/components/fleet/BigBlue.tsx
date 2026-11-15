import Wheel from "./Wheel";

// Big Blue: a lifted, two-tone blue and silver full-size pickup with a chrome roll bar behind the
// cab, a long bed with a black cover, and mud tires on polished wheels. An original drawing, no
// badges or plates.
const BODY =
  "M 46,134 L 46,88 L 190,88 L 190,62 Q 190,52 200,52 L 244,52 L 268,82 L 338,88 Q 358,90 360,106 L 360,134 Z";

export default function BigBlue() {
  return (
    <svg viewBox="36 20 340 164" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Big Blue, a lifted blue and silver pickup with a chrome roll bar and big mud tires" className="h-full w-full">
      <defs>
        <clipPath id="bigblue-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="bigblue-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3156c9" />
          <stop offset="1" stopColor="#15246d" />
        </linearGradient>
        <linearGradient id="bigblue-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e8ee" />
          <stop offset="1" stopColor="#9aa3b2" />
        </linearGradient>
        <linearGradient id="bigblue-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e8299" />
          <stop offset="1" stopColor="#1c2738" />
        </linearGradient>
      </defs>
      <ellipse cx="205" cy="178" rx="170" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* the chrome roll bar, two hoops behind the cab */}
        <path d="M 176,90 L 176,54 Q 176,44 186,44 L 204,44 Q 212,44 212,54 L 212,90" fill="none" stroke="#dfe6f0" strokeWidth="5" strokeLinecap="round" />
        <path d="M 188,90 L 188,56 Q 188,48 196,48" fill="none" stroke="#9aa3b2" strokeWidth="3.5" strokeLinecap="round" />
        <path d={BODY} fill="url(#bigblue-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#bigblue-clip)">
          <circle cx="110" cy="148" r="36" fill="#05080f" />
          <circle cx="308" cy="148" r="36" fill="#05080f" />
          {/* silver: the bed rail, the cab top and hood, the rocker band */}
          <rect x="44" y="86" width="148" height="6" fill="url(#bigblue-silver)" />
          <path d="M 190,52 L 244,52 L 268,82 L 360,88 L 360,100 L 268,96 L 266,84 L 252,70 L 190,70 Z" fill="url(#bigblue-silver)" />
          <rect x="44" y="120" width="318" height="14" fill="url(#bigblue-silver)" />
          <rect x="44" y="124" width="318" height="4" fill="#1c2a6e" />
        </g>
        {/* the black bed cover and the tailgate stripe */}
        <path d="M 52,82 L 186,82 L 186,88 L 52,88 Z" fill="#12161f" stroke="#050816" strokeWidth="2" />
        <path d="M 46,100 L 188,100" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        {/* the cab: tinted glass, the door seam, the handle, the mirror */}
        <path d="M 200,58 L 242,58 L 262,80 L 200,80 Z" fill="url(#bigblue-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 202,80 V 120 M 258,84 V 120" stroke="#0e1230" strokeWidth="2" />
        <rect x="212" y="98" width="14" height="4" rx="2" fill="#dfe6f0" />
        <rect x="262" y="74" width="9" height="12" rx="2" fill="#0a0d16" />
        {/* the lights, the grille, the chrome bumpers */}
        <path d="M 340,92 L 358,95 L 358,102 L 340,99 Z" fill="#fff6c8" stroke="#050816" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 344,104 L 360,106 L 360,116 L 344,114 Z" fill="#0a0f1c" />
        <rect x="340" y="118" width="26" height="9" rx="3" fill="#dfe6f0" stroke="#050816" strokeWidth="2" />
        <rect x="36" y="120" width="16" height="9" rx="3" fill="#2a3042" stroke="#050816" strokeWidth="2" />
        <rect x="46" y="92" width="8" height="18" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={110} cy={148} r={30} rim="#e4e9f1" spoke="#8d97a6" spokes={6} knobs={16} />
      <Wheel cx={308} cy={148} r={30} rim="#e4e9f1" spoke="#8d97a6" spokes={6} knobs={16} />
    </svg>
  );
}
