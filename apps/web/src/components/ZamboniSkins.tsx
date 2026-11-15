import type { ReactNode } from "react";

// Skins for the ice resurfacer model. Each skin is a full wrap painted on the machine's side, like
// the vinyl wraps real rink machines wear. A wrap is drawn in a 282 by 126 box, and everything that
// has to be read sits inside the safe zone, x 34 to 248 and y 22 to 92, centered on x 141, above the
// wheels and clear of the rounded nose and the back wall. The machine can drive either way, so the
// art keeps margin on both ends, and every word has a fixed width so it cannot spill off the side.
//
// The wraps use each name's key colors, type, and signature shapes, redrawn here as original
// vectors, not the official logo files. A skin is a thank-you or a bit of fun, never an endorsement.
export type Skin = {
  id: string;
  name: string;
  short?: string; // a shorter name for the one-line caption, when the full name would wrap
  href: string; // where a click on the machine goes, in a new tab
  line: string;
  base: [string, string]; // the paint under the wrap, top and bottom
  wrap: ReactNode;
};

const SANS = "Arial, Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const OVERPASS = "var(--font-overpass), Overpass, Arial, sans-serif";

// Sploosh.AI's mascot, a blue blob with an antenna, a black screen face, and two pill eyes.
function SplooshMascot() {
  return (
    <g>
      <circle cx="250" cy="45" r="28" fill="#2370e0" />
      <path d="M 232,66 L 268,66 L 282,135 L 220,135 Z" fill="#2370e0" />
      <path d="M 40,330 C 20,190 150,120 250,125 C 400,130 500,260 470,360 C 450,430 300,480 200,470 C 100,460 55,420 40,330 Z" fill="#2370e0" />
      <path d="M 110,300 C 120,200 230,165 330,170 C 430,180 475,250 465,320 C 455,400 330,435 250,430 C 160,425 105,370 110,300 Z" fill="#1a1c22" />
      <rect x="180" y="255" width="54" height="100" rx="27" fill="#f5f5f5" />
      <rect x="358" y="255" width="54" height="100" rx="27" fill="#f5f5f5" />
    </g>
  );
}

function Sparkle({ x, y, s = 1, fill = "#fff" }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d={`M ${x},${y - 6 * s} Q ${x + 1 * s},${y - 1 * s} ${x + 6 * s},${y} Q ${x + 1 * s},${y + 1 * s} ${x},${y + 6 * s} Q ${x - 1 * s},${y + 1 * s} ${x - 6 * s},${y} Q ${x - 1 * s},${y - 1 * s} ${x},${y - 6 * s} Z`} fill={fill} />;
}

// One of the Polish elephants as in the "suited up" photo: a seated gray plush facing the viewer, big
// floppy ears, a short trunk, and a white swm t-shirt, with a keyring on top. Drawn in a 40 by 46 box,
// original art.
function PolishElephant({ x, y, scale = 1, tag = false }: { x: number; y: number; scale?: number; tag?: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} stroke="#060f33" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="27" cy="2.5" r="2.2" fill="none" stroke="#c9ced6" strokeWidth="1" />
      <ellipse cx="6" cy="14" rx="6.5" ry="8" fill="#a9afb9" />
      <ellipse cx="34" cy="14" rx="6.5" ry="8" fill="#a9afb9" />
      <ellipse cx="7" cy="14" rx="3.2" ry="5.2" fill="#c2c7cf" strokeWidth="0.5" />
      <ellipse cx="33" cy="14" rx="3.2" ry="5.2" fill="#c2c7cf" strokeWidth="0.5" />
      <ellipse cx="7" cy="40" rx="6.5" ry="5" fill="#bfc4cc" />
      <ellipse cx="33" cy="40" rx="6.5" ry="5" fill="#bfc4cc" />
      <ellipse cx="4.5" cy="30" rx="4.5" ry="6" fill="#bfc4cc" />
      <ellipse cx="35.5" cy="30" rx="4.5" ry="6" fill="#bfc4cc" />
      <rect x="9" y="22" width="22" height="17" rx="6" fill="#f2f4f8" />
      <text x="20" y="33.5" textAnchor="middle" fontSize="6" fontWeight="800" fill="#2646c8" fontFamily={SANS} stroke="none">
        swm
      </text>
      <circle cx="20" cy="13" r="10" fill="#bfc4cc" />
      <ellipse cx="20" cy="19" rx="4" ry="5.5" fill="#a9afb9" />
      <circle cx="15.5" cy="11" r="1.3" fill="#060f33" stroke="none" />
      <circle cx="24.5" cy="11" r="1.3" fill="#060f33" stroke="none" />
      {tag && <rect x="34" y="24" width="6" height="8" fill="#ffffff" strokeWidth="0.6" />}
    </g>
  );
}

// The Claude spark: an uneven burst of rounded rays in clay.
function ClaudeSpark({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rays = [1, 0.7, 0.92, 0.62, 1, 0.74, 0.9, 0.66, 0.98, 0.72, 0.88, 0.64];
  return (
    <g stroke="#d97757" strokeLinecap="round" fill="none">
      {rays.map((len, i) => (
        <path
          key={i}
          d={`M ${cx},${cy - r * 0.18} L ${cx},${cy - r * len}`}
          strokeWidth={r * 0.2}
          transform={`rotate(${i * 30 + (i % 2) * 4} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

// The NASA insignia redrawn: the blue sphere, stars, the white orbit, and the red vector.
function Meatball({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0b3d91" stroke="#fff" strokeWidth="1.2" />
      {[
        [-0.55, -0.45], [0.4, -0.6], [0.62, 0.3], [-0.2, 0.62], [-0.65, 0.15], [0.1, -0.2],
      ].map(([x, y], i) => (
        <circle key={i} cx={cx + x * r} cy={cy + y * r} r={r * 0.045} fill="#fff" />
      ))}
      <ellipse cx={cx} cy={cy} rx={r * 1.02} ry={r * 0.36} fill="none" stroke="#fff" strokeWidth={r * 0.1} transform={`rotate(-22 ${cx} ${cy})`} />
      <path d={`M ${cx - r * 0.78},${cy + r * 0.52} Q ${cx - r * 0.1},${cy - r * 0.55} ${cx + r * 0.74},${cy - r * 0.46} Q ${cx + r * 0.05},${cy - r * 0.05} ${cx - r * 0.78},${cy + r * 0.52} Z`} fill="#fc3d21" />
      <text x={cx} y={cy + r * 0.58} textAnchor="middle" fontSize={r * 0.46} fontWeight="900" fontStyle="italic" fill="#fff" fontFamily={SANS} letterSpacing="-0.5">
        NASA
      </text>
    </g>
  );
}

// Kraken Bear, line art only, a bear in a plain hoodie sitting in an upside-down cap, traced from
// the classic photo. No logos, no lettering.
function KrakenBearOutline({ stroke = "#99d9d9" }: { stroke?: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 14,46 Q 40,64 66,46" />
      <path d="M 10,44 L 70,42" />
      <path d="M 17,48 Q 40,60 63,48" opacity="0.5" />
      <path d="M 22,43 Q 20,30 30,25 L 50,25 Q 60,30 58,43" />
      <path d="M 30,25 Q 40,31 50,25" />
      <path d="M 36,30 L 36,38 M 44,30 L 44,38" opacity="0.7" />
      <path d="M 20,41 Q 14,41 15,36 Q 17,32 22,34" />
      <path d="M 60,41 Q 66,41 65,36 Q 63,32 58,34" />
      <circle cx="40" cy="14" r="10" />
      <circle cx="31" cy="6" r="3.6" />
      <circle cx="49" cy="6" r="3.6" />
      <ellipse cx="40" cy="17" rx="4.6" ry="3.6" />
      <ellipse cx="40" cy="15.4" rx="1.7" ry="1.2" fill={stroke} />
      <circle cx="35.5" cy="12" r="1" fill={stroke} />
      <circle cx="44.5" cy="12" r="1" fill={stroke} />
    </g>
  );
}

const outline = { paintOrder: "stroke", strokeLinejoin: "round" } as const;

export const skins: Skin[] = [
  {
    id: "sploosh",
    name: "Sploosh.AI",
    href: "https://sploosh.ai",
    line: "Where the hockey analytics live.",
    base: ["#143a73", "#0a1c3d"],
    wrap: (
      <>
        <path d="M 0,100 Q 35,90 70,100 T 140,100 T 210,100 T 282,98 V 126 H 0 Z" fill="#2370e0" opacity="0.55" />
        <path d="M 0,110 Q 35,102 70,110 T 140,110 T 210,110 T 282,108 V 126 H 0 Z" fill="#2370e0" opacity="0.8" />
        <g transform="translate(43,24) scale(0.128)">
          <SplooshMascot />
        </g>
        <text x="115" y="58" fontSize="25" fontWeight="800" fill="#fff" fontFamily={SANS} letterSpacing="0.4" stroke="#0a1c3d" strokeWidth="3" style={outline}>
          Sploosh<tspan fill="#5aa2ff">.AI</tspan>
        </text>
        <text x="116" y="78" fontSize="9" fontWeight="800" fill="#cfe3ff" fontFamily={SANS} textLength="118" lengthAdjust="spacing">
          HOCKEY ANALYTICS
        </text>
      </>
    ),
  },
  {
    id: "claude",
    name: "Claude Sonnet 5.5, Fable 5.2",
    short: "Claude, two models",
    href: "https://claude.com/product/overview",
    line: "The AI pit crew that helped build this.",
    base: ["#f7f2e8", "#e6dcc6"],
    wrap: (
      <>
        <path d="M 0,104 H 282 V 126 H 0 Z" fill="#d97757" opacity="0.9" />
        <path d="M 0,98 H 282" stroke="#d97757" strokeWidth="2" />
        <ClaudeSpark cx={70} cy={56} r={30} />
        <text x="112" y="62" fontSize="40" fontWeight="600" fill="#1f1d1a" fontFamily={SERIF} textLength="130" lengthAdjust="spacingAndGlyphs">
          Claude
        </text>
        <text x="114" y="77" fontSize="13.5" fontStyle="italic" fill="#b4562f" fontFamily={SERIF} textLength="84" lengthAdjust="spacingAndGlyphs">
          Sonnet 5.5
        </text>
        <text x="114" y="91" fontSize="13.5" fontStyle="italic" fill="#b4562f" fontFamily={SERIF} textLength="76" lengthAdjust="spacingAndGlyphs">
          Fable 5.2
        </text>
      </>
    ),
  },
  {
    id: "spaceapps",
    name: "NASA Space Apps Challenge",
    href: "https://www.spaceappschallenge.org/",
    line: "The weekend that started it all.",
    base: ["#0b3d91", "#04122e"],
    wrap: (
      <>
        {[...Array(26)].map((_, i) => (
          <circle key={i} cx={(i * 47 + 10) % 282} cy={(i * 31) % 120} r={i % 6 === 0 ? 1.7 : 0.9} fill="#fff" opacity={0.45 + (i % 3) * 0.2} />
        ))}
        <path d="M 0,102 Q 70,86 140,100 T 282,92 V 126 H 0 Z" fill="#fc3d21" opacity="0.85" />
        <Meatball cx={64} cy={57} r={27} />
        <text x="104" y="38" fontSize="15" fontWeight="900" fill="#fc3d21" fontFamily={SANS} textLength="58" lengthAdjust="spacing" stroke="#04122e" strokeWidth="3" style={outline}>
          NASA
        </text>
        <text x="104" y="63" fontSize="28" fontWeight="900" fill="#fff" fontFamily={SANS} textLength="140" lengthAdjust="spacingAndGlyphs" stroke="#04122e" strokeWidth="3.5" style={outline}>
          SPACE APPS
        </text>
        <text x="104" y="82" fontSize="15" fontWeight="800" fill="#9fc3ff" fontFamily={SANS} textLength="140" lengthAdjust="spacing">
          CHALLENGE
        </text>
      </>
    ),
  },
  {
    id: "charlotte",
    name: "Space Apps Charlotte",
    href: "https://www.spaceappsclt.org/",
    line: "Thanks for hosting the local event.",
    base: ["#ffffff", "#cfe0fb"],
    wrap: (
      <>
        {/* a burst of rays behind the name, in the site's blue and yellow */}
        <g transform="translate(141,70)" opacity="0.16">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d="M 0,0 L -9,-110 L 9,-110 Z" fill="#1155cc" transform={`rotate(${i * (360 / 14)})`} />
          ))}
        </g>
        {/* stars */}
        <Sparkle x={40} y={62} s={2} fill="#ffe500" />
        <Sparkle x={244} y={44} s={1.6} fill="#ffe500" />
        <Sparkle x={228} y={80} s={1.2} fill="#e43700" />
        <Sparkle x={58} y={88} s={1.2} fill="#1155cc" />
        {/* the ribbon: local event host */}
        <g>
          <path d="M 38,22 L 52,22 L 46,30 L 52,38 L 38,38 L 44,30 Z" fill="#b92d00" />
          <path d="M 244,22 L 230,22 L 236,30 L 230,38 L 244,38 L 238,30 Z" fill="#b92d00" />
          <path d="M 50,19 H 232 V 41 H 50 Z" fill="#e43700" stroke="#7a1d00" strokeWidth="1.4" />
          <path d="M 50,41 L 58,46 V 41 Z M 232,41 L 224,46 V 41 Z" fill="#7a1d00" />
          <text x="141" y="34" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily={OVERPASS} textLength="160" lengthAdjust="spacing">
            LOCAL EVENT HOST
          </text>
        </g>
        {/* the names */}
        <text x="141" y="62" textAnchor="middle" fontSize="27" fontWeight="900" fill="#1155cc" fontFamily={OVERPASS} textLength="150" lengthAdjust="spacingAndGlyphs" stroke="#fff" strokeWidth="3" style={outline}>
          Space Apps
        </text>
        <text x="141" y="86" textAnchor="middle" fontSize="27" fontWeight="900" fill="#e43700" fontFamily={OVERPASS} textLength="170" lengthAdjust="spacingAndGlyphs" stroke="#fff" strokeWidth="3" style={outline}>
          CHARLOTTE
        </text>
        {/* the Queen City skyline, low along the bottom */}
        <g fill="#1155cc" transform="translate(0,100) scale(1,0.3) translate(0,-100)">
          <path d="M 0,126 V 98 H 14 V 86 H 26 V 98 H 40 V 80 L 46,68 L 52,80 V 98 H 66 V 90 H 84 V 98 H 100 V 76 H 112 V 98 H 128 V 88 H 150 V 98 H 166 V 72 L 174,60 L 182,72 V 98 H 200 V 84 H 218 V 98 H 236 V 90 H 254 V 98 H 282 V 126 Z" />
        </g>
        <rect x="0" y="100" width="282" height="26" fill="#1155cc" />
      </>
    ),
  },
  {
    id: "swm",
    name: "Software Mansion",
    href: "https://swmansion.com/",
    line: "Where the Polish elephants hail from, in Kraków.",
    base: ["#0f2260", "#060f33"],
    wrap: (
      <>
        <path d="M 0,102 Q 70,92 140,102 T 282,98 V 126 H 0 Z" fill="#7a4dff" opacity="0.5" />
        <path d="M 0,112 Q 70,104 140,112 T 282,110 V 126 H 0 Z" fill="#7a4dff" opacity="0.8" />
        <Sparkle x={126} y={30} s={1.2} fill="#b9a3ff" />
        <Sparkle x={236} y={34} s={1} fill="#b9a3ff" />
        <PolishElephant x={34} y={36} scale={1.05} />
        <PolishElephant x={80} y={36} scale={1.05} tag />
        <text x="136" y="54" fontSize="22" fontWeight="800" fill="#fff" fontFamily={SANS} textLength="110" lengthAdjust="spacingAndGlyphs" stroke="#060f33" strokeWidth="3" style={outline}>
          Software
        </text>
        <text x="136" y="76" fontSize="20" fontWeight="800" fill="#b9a3ff" fontFamily={SANS} textLength="110" lengthAdjust="spacingAndGlyphs" stroke="#060f33" strokeWidth="3" style={outline}>
          Mansion
        </text>
      </>
    ),
  },
  {
    id: "kraken-bear",
    name: "Kraken Bear",
    href: "https://www.nhl.com/kraken/",
    line: "Zamboni nut, in his favorite upside-down cap.",
    base: ["#0b2f47", "#001628"],
    wrap: (
      <>
        <g fill="none" stroke="#68a2b9" strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <path d="M 0,100 Q 40,84 80,100 T 160,98 T 240,100 T 282,96" />
          <path d="M 0,112 Q 40,96 80,112 T 160,110 T 240,112 T 282,108" />
        </g>
        <text x="36" y="58" fontSize="31" fontWeight="900" fill="#99d9d9" fontFamily={SANS} textLength="116" lengthAdjust="spacingAndGlyphs" stroke="#001628" strokeWidth="3.5" style={outline}>
          KRAKEN
        </text>
        <text x="37" y="82" fontSize="20" fontWeight="900" fill="#fff" fontFamily={SANS} textLength="114" lengthAdjust="spacing" stroke="#001628" strokeWidth="3" style={outline}>
          BEAR
        </text>
        <g transform="translate(160,24)">
          <KrakenBearOutline />
        </g>
      </>
    ),
  },
  {
    id: "uptown-china",
    name: "Uptown China",
    href: "https://www.theinfatuation.com/seattle/reviews/uptown-china-restaurant",
    line: "Great Chinese food and heavy-pour drinks, a furball favorite near the arena.",
    base: ["#d1202f", "#7a0f19"],
    wrap: (
      <>
        {[0, 1].map((row) => (
          <path
            key={row}
            d={`M 0,${row ? 110 : 7} h 14 v 6 h -8 v -3 h 4 ` + Array.from({ length: 19 }, () => "h 14 v 6 h -8 v -3 h 4").join(" ")}
            fill="none"
            stroke="#f2b705"
            strokeWidth="1.8"
            opacity="0.8"
          />
        ))}
        {[44, 238].map((x) => (
          <g key={x} transform={`translate(${x},40)`}>
            <path d="M 0,-12 V -6" stroke="#f2b705" strokeWidth="2" />
            <ellipse cx="0" cy="8" rx="12" ry="14" fill="#ef4444" stroke="#f2b705" strokeWidth="2" />
            <path d="M -6,-4 Q -3,8 -6,20 M 0,-6 V 22 M 6,-4 Q 3,8 6,20" stroke="#7a0f19" strokeWidth="1" fill="none" />
            <path d="M 0,22 V 30 M -3,30 H 3" stroke="#f2b705" strokeWidth="2" />
          </g>
        ))}
        <text x="141" y="50" textAnchor="middle" fontSize="32" fontWeight="900" fill="#f9d56e" fontFamily={SERIF} textLength="132" lengthAdjust="spacingAndGlyphs" stroke="#5a0b12" strokeWidth="4" style={outline}>
          UPTOWN
        </text>
        <text x="141" y="76" textAnchor="middle" fontSize="27" fontWeight="900" fill="#fff" fontFamily={SERIF} textLength="104" lengthAdjust="spacingAndGlyphs" stroke="#5a0b12" strokeWidth="4" style={outline}>
          CHINA
        </text>
        <text x="141" y="89" textAnchor="middle" fontSize="8" fontWeight="800" fill="#f9d56e" fontFamily={SANS} textLength="126" lengthAdjust="spacing">
          GOOD FOOD · HEAVY POURS
        </text>
      </>
    ),
  },
];
