import Wheel from "./Wheel";

// The golf cart: a lifted, dark blue four-seater with a flat black roof, a tinted fold-down
// windshield, a front bench, a rear seat that flips to face backward, a rear deck, and big knobby
// tires on black and silver wheels. An original drawing, no badges or plates.
const BODY =
  "M 66,152 L 66,110 Q 66,98 78,96 L 132,96 L 216,118 L 284,118 L 284,106 Q 288,94 300,94 L 338,98 Q 354,102 354,122 L 354,152 Z";

export default function GolfCart() {
  return (
    <svg viewBox="36 20 332 160" preserveAspectRatio="xMidYMax meet" role="img" aria-label="The golf cart, a lifted dark blue four-seater with a black roof and a back seat that faces backward" className="h-full w-full">
      <defs>
        <clipPath id="cart-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="cart-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b7bf0" />
          <stop offset="1" stopColor="#1d3aa8" />
        </linearGradient>
      </defs>
      <ellipse cx="205" cy="174" rx="165" ry="6" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* the rear deck and its grab rail */}
        <path d="M 42,132 L 96,132 L 96,142 L 48,142 Q 42,142 42,136 Z" fill="#3a4258" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 48,132 V 100 Q 48,94 54,94 L 90,94" fill="none" stroke="#4a546e" strokeWidth="4.5" strokeLinecap="round" />
        {/* the rear posts and the roof */}
        <path d="M 96,40 V 100" stroke="#4a546e" strokeWidth="5" strokeLinecap="round" />
        <path d="M 142,40 V 70" stroke="#4a546e" strokeWidth="5" strokeLinecap="round" />
        {/* the body with its wheel arches */}
        <path d={BODY} fill="url(#cart-paint)" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#cart-clip)">
          <circle cx="108" cy="148" r="34" fill="#0a0f1c" />
          <circle cx="312" cy="148" r="34" fill="#0a0f1c" />
          {/* the black floor and the chassis step */}
          <rect x="216" y="118" width="68" height="20" fill="#2a3042" />
          <rect x="64" y="142" width="294" height="10" fill="#2a3042" />
        </g>
        <path d="M 74,108 Q 160,100 290,112" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        {/* the rear seat cushion, facing backward, and the shared seat back */}
        <path d="M 66,102 L 128,102 L 128,111 L 66,111 Q 62,111 62,107 Q 62,102 66,102 Z" fill="#3a4258" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 128,114 L 128,78 Q 128,68 138,68 Q 148,68 148,78 L 148,114 Z" fill="#3a4258" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* the front bench */}
        <path d="M 150,102 L 214,102 Q 220,102 220,108 L 220,116 L 150,116 Z" fill="#3a4258" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 160,102 Q 160,92 172,92 L 206,92" fill="none" stroke="#4a546e" strokeWidth="4" strokeLinecap="round" />
        {/* the steering column, the wheel, and the dash */}
        <path d="M 296,112 L 262,80" stroke="#4a546e" strokeWidth="5" strokeLinecap="round" />
        <path d="M 250,80 Q 262,66 274,82" fill="none" stroke="#4a546e" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 288,100 L 330,102 L 330,112 L 288,110 Z" fill="#0d1018" />
        {/* the tinted windshield, the front post, the roof */}
        <path d="M 316,38 L 336,40 L 306,98 L 296,94 Z" fill="#9fb3c8" fillOpacity="0.4" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 322,40 L 298,100" stroke="#4a546e" strokeWidth="5" strokeLinecap="round" />
        <path d="M 76,38 Q 70,38 70,32 Q 70,26 78,26 L 336,26 Q 352,26 352,34 Q 352,40 344,40 L 84,40 Z" fill="#4b5672" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 80,31 L 340,31" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        {/* the front lights and the tail light */}
        <path d="M 338,106 L 352,110 L 352,122 L 338,118 Z" fill="#fff6c8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <rect x="66" y="114" width="7" height="12" rx="2" fill="#e63946" />
      </g>
      <Wheel cx={108} cy={148} r={28} rim="#c9ced6" spoke="#2b303b" spokes={5} knobs={14} />
      <Wheel cx={312} cy={148} r={28} rim="#c9ced6" spoke="#2b303b" spokes={5} knobs={14} />
    </svg>
  );
}
