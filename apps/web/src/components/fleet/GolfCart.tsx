import Wheel from "./Wheel";

// The golf cart: an open dark blue cart with a roof, a bench seat up front and a back seat that
// faces backward, for getting around the whole property. An original drawing, no badges or plates.
export default function GolfCart() {
  return (
    <svg viewBox="40 30 330 150" preserveAspectRatio="xMidYMax meet" role="img" aria-label="The golf cart, an open dark blue cart with a roof and a back seat that faces backward" className="h-full w-full">
      <defs>
        <linearGradient id="cart-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f55a8" />
          <stop offset="1" stopColor="#16296a" />
        </linearGradient>
      </defs>
      <ellipse cx="205" cy="172" rx="160" ry="7" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* roof, on posts at the back and the front */}
        <path d="M 72,40 L 316,40 Q 326,40 326,48 L 326,50 L 62,50 L 62,48 Q 62,40 72,40 Z" fill="#e9eef7" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 84,50 V120 M 300,50 V104" stroke="#6c7686" strokeWidth="5" strokeLinecap="round" />
        {/* the rear seat, facing backward */}
        <path d="M 66,124 L 66,84 Q 66,78 72,78 L 86,78 L 86,124 Z" fill="#2a2f3d" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 86,118 L 122,118 L 122,128 L 86,128 Z" fill="#2a2f3d" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* the front bench, seat back and cushion */}
        <path d="M 140,124 L 140,82 Q 140,76 146,76 L 160,76 L 162,124 Z" fill="#e3c394" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 160,116 L 246,116 L 246,128 L 160,128 Z" fill="#e3c394" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* the windshield, steering column, and wheel */}
        <path d="M 296,50 L 314,52 L 318,104 L 296,104 Z" fill="#8ecae6" fillOpacity="0.42" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 290,112 L 268,84" stroke="#6c7686" strokeWidth="5" strokeLinecap="round" />
        <path d="M 256,86 q 8,-8 16,0" stroke="#050816" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* the floor, and the front and rear body panels, the sides stay open */}
        <path d="M 62,136 Q 62,128 70,128 L 120,128 L 128,138 L 288,138 L 292,112 L 338,112 Q 356,114 358,130 L 358,146 Q 358,152 352,152 L 68,152 Q 62,152 62,146 Z" fill="url(#cart-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 66,138 L 350,142" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        <path d="M 336,114 L 354,118 L 354,128 L 336,124 Z" fill="#fff6c8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <rect x="62" y="130" width="6" height="12" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={104} cy={148} r={24} rim="#d7dde6" spoke="#9aa8ba" spokes={6} />
      <Wheel cx={316} cy={148} r={24} rim="#d7dde6" spoke="#9aa8ba" spokes={6} />
    </svg>
  );
}
