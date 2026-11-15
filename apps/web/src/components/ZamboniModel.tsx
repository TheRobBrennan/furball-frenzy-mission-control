import type { Skin } from "./ZamboniSkins";

// The ice resurfacer, a Zamboni drawn from the side and facing right, modeled on the real rink
// machines: a big rounded tank, a tall back wall with the driver's platform and seat, chrome wheels,
// amber lamps, and the conditioner dragging behind. The side of the tank is a blank canvas for a skin.
const BODY =
  "M 84,150 L 84,48 Q 84,36 98,34 L 232,24 Q 304,20 340,52 Q 366,74 366,112 L 366,150 Z";

function Rim({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="32" fill="#0a0f1c" stroke="#050816" strokeWidth="2.5" />
      <g className="fleet-wheel">
        <circle cx={cx} cy={cy} r="20" fill="#c9d1dc" stroke="#050816" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M ${cx},${cy - 4} L ${cx},${cy - 17}`} stroke="#5d6879" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 45} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="6" fill="#8d97a8" stroke="#050816" strokeWidth="1.5" />
      </g>
    </g>
  );
}

export default function ZamboniModel({ skin, flipText = false }: { skin: Skin; flipText?: boolean }) {
  const id = `zam-${skin.id}`;
  return (
    <svg viewBox="0 0 420 200" role="img" aria-label={`A Zamboni ice resurfacer wearing the ${skin.name} skin`} className="h-full w-auto">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skin.base[0]} />
          <stop offset="1" stopColor={skin.base[1]} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* the conditioner dragging behind, the edger, and the chain */}
      <path d="M 70,140 L 40,150" stroke="#6b7586" strokeWidth="3" strokeLinecap="round" />
      <path d="M 44,142 L 8,142 L 8,176 L 44,176 Z" fill="#aab3c2" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 12,150 H 40 M 12,160 H 40 M 12,170 H 40" stroke="#6b7586" strokeWidth="1.5" />
      <rect x="2" y="170" width="10" height="8" rx="2" fill="#dfe6ee" stroke="#050816" strokeWidth="1.5" />

      {/* the driver's platform, seat, steering wheel, and the driver */}
      <path d="M 40,128 H 96 V 138 H 40 Q 36,138 36,134 Q 36,128 40,128 Z" fill="#8d97a8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 44,131 H 92" stroke="#c9d1dc" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M 40,126 L 38,84 Q 38,78 44,78 H 56 Q 62,78 62,84 L 64,126 Z" fill="#242a38" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
      <g>
        <circle cx="62" cy="58" r="9" fill="#f1c9a5" stroke="#050816" strokeWidth="1.8" />
        <path d="M 52,56 Q 52,46 62,46 Q 72,46 72,56 Z" fill="#1f2937" stroke="#050816" strokeWidth="1.5" />
        <path d="M 70,56 L 78,58" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M 52,68 Q 52,64 62,64 Q 74,64 76,76 L 78,104 L 56,104 Z" fill="#dc2626" stroke="#050816" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M 70,76 L 88,86" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <path d="M 58,104 L 64,126 L 80,126 L 78,104 Z" fill="#374151" stroke="#050816" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <path d="M 92,78 L 102,66" stroke="#242a38" strokeWidth="4" strokeLinecap="round" />
      <circle cx="104" cy="64" r="9" fill="none" stroke="#242a38" strokeWidth="3.5" />

      {/* the exhaust stack and the light on the roof */}
      <path d="M 120,34 V 16 Q 120,10 126,10 Q 132,10 132,16" fill="none" stroke="#b8860b" strokeWidth="4" strokeLinecap="round" />
      <rect x="196" y="18" width="22" height="7" rx="2" fill="#fff" stroke="#050816" strokeWidth="1.5" />
      <rect x="238" y="14" width="14" height="8" rx="2" fill="#38bdf8" stroke="#050816" strokeWidth="1.5" />

      {/* the tank, with its wrap */}
      <path d={BODY} fill={`url(#${id}-paint)`} stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
      <g clipPath={`url(#${id}-clip)`}>
        <g transform="translate(84,24)">
          {/* when the whole rink is flipped to drive the other way, the wrap is flipped back so it reads right */}
          <g transform={flipText ? "translate(282,0) scale(-1,1)" : undefined}>{skin.wrap}</g>
        </g>
        <path d={BODY} fill={`url(#${id}-sheen)`} />
        <circle cx="122" cy="148" r="36" fill="#05080f" />
        <circle cx="316" cy="148" r="36" fill="#05080f" />
        <rect x="80" y="142" width="290" height="10" fill="#1d2330" opacity="0.8" />
        {/* the access panel and its handle */}
        <path d="M 160,118 H 276" stroke="#050816" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      <rect x="86" y="100" width="6" height="14" rx="2" fill="#aab3c2" stroke="#050816" strokeWidth="1.2" />

      {/* front lamps and bumper */}
      <path d="M 360,118 L 372,120 L 372,138 L 360,136 Z" fill="#fbbf24" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
      <rect x="356" y="144" width="24" height="9" rx="3" fill="#2a3042" stroke="#050816" strokeWidth="2" />

      {/* the side brush */}
      <circle cx="262" cy="170" r="9" fill="#f5f1e8" stroke="#050816" strokeWidth="2" />
      <path d="M 262,152 V 162" stroke="#6b7586" strokeWidth="4" />

      <Rim cx={122} cy={148} />
      <Rim cx={316} cy={148} />
    </svg>
  );
}
