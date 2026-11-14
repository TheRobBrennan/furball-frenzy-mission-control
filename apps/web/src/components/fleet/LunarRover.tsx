// The elephants' lunar rover, traced from Rob's own photo of both Polish elephants riding it: one
// stacked on the other, driving together, the Bunny system, safety and silliness first. The rover
// is the toy lunar buggy the real one is built from, seen head on: big knobbly tires, a gold axle,
// a grey tool box up front, twin lights on each side, and a little display. The coordinates follow
// the photo, no logos, no brand artwork.
const OUTLINE = "#0a0f1c";
const SW = 9;

export default function LunarRover({ className = "h-auto w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="40 40 920 2040"
      role="img"
      aria-label="The elephants' lunar rover seen from the front, with both Polish elephants stacked on top of each other, driving"
      className={className}
    >
      <defs>
        <linearGradient id="rover-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#aab3c0" />
          <stop offset="1" stopColor="#7e8898" />
        </linearGradient>
      </defs>
      <ellipse cx="500" cy="2060" rx="440" ry="22" fill="#000" opacity="0.4" />
      <g className="fleet-body">
        {/* the lower elephant, behind the controls */}
        <path d="M 330,930 Q 150,860 140,960 Q 150,1060 330,1080 Z" fill="#9aa3ae" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 740,920 Q 835,900 842,1000 Q 832,1062 740,1052 Z" fill="#9aa3ae" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <rect x="290" y="1150" width="500" height="190" rx="70" fill="#f1f5ff" stroke={OUTLINE} strokeWidth={SW} />
        <circle cx="285" cy="1262" r="72" fill="#b7bec8" stroke={OUTLINE} strokeWidth={SW} />
        <circle cx="835" cy="1245" r="66" fill="#b7bec8" stroke={OUTLINE} strokeWidth={SW} />
        <ellipse cx="545" cy="1010" rx="215" ry="190" fill="#c6ccd3" stroke={OUTLINE} strokeWidth={SW} />
        <path d="M 565,1065 Q 600,1130 645,1195" fill="none" stroke={OUTLINE} strokeWidth="112" strokeLinecap="round" />
        <path d="M 565,1065 Q 600,1130 645,1195" fill="none" stroke="#c6ccd3" strokeWidth="94" strokeLinecap="round" />
        <ellipse cx="500" cy="1022" rx="25" ry="21" fill={OUTLINE} />
        <ellipse cx="632" cy="1002" rx="25" ry="21" fill={OUTLINE} />
        <circle cx="508" cy="1014" r="6" fill="#fff" />
        <circle cx="640" cy="994" r="6" fill="#fff" />

        {/* the elephant on top, trunk up, stacked on the first */}
        <path d="M 235,345 Q 95,265 72,345 Q 92,455 190,505 Z" fill="#aeb6c0" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 200,560 Q 310,480 530,500 Q 690,520 705,610 L 650,710 L 245,730 Z" fill="#f1f5ff" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <circle cx="265" cy="760" r="122" fill="#b7bec8" stroke={OUTLINE} strokeWidth={SW} />
        <circle cx="765" cy="650" r="125" fill="#b7bec8" stroke={OUTLINE} strokeWidth={SW} />
        <ellipse cx="405" cy="392" rx="192" ry="160" fill="#c6ccd3" stroke={OUTLINE} strokeWidth={SW} />
        <path d="M 475,330 Q 512,190 478,100" fill="none" stroke={OUTLINE} strokeWidth="132" strokeLinecap="round" />
        <path d="M 475,330 Q 512,190 478,100" fill="none" stroke="#c6ccd3" strokeWidth="114" strokeLinecap="round" />
        <ellipse cx="338" cy="338" rx="23" ry="20" fill={OUTLINE} />
        <circle cx="345" cy="331" r="6" fill="#fff" />
        <path d="M 345,430 q 40,34 90,4" fill="none" stroke={OUTLINE} strokeWidth="9" strokeLinecap="round" />

        {/* the rover: tires, the gold axle, the tool box, the handlebar, the lights, the display */}
        <path d="M 82,1765 Q 52,1905 98,2040 Q 150,2090 232,2062 Q 278,1990 266,1850 Q 256,1738 190,1720 Q 122,1714 82,1765 Z" fill="#151a28" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 800,1712 Q 788,1850 806,1982 Q 852,2012 922,1982 Q 962,1882 942,1762 Q 902,1690 852,1690 Q 810,1690 800,1712 Z" fill="#151a28" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <g fill="#2b3347" stroke="#050816" strokeWidth="3">
          {[
            [92, 1800], [86, 1880], [100, 1960], [140, 2036], [200, 2046], [250, 1990], [258, 1900], [246, 1810],
            [810, 1740], [806, 1830], [818, 1920], [870, 1992], [930, 1950], [945, 1860], [930, 1780],
          ].map(([x, y], i) => (
            <rect key={i} x={x - 24} y={y - 20} width="48" height="40" rx="14" />
          ))}
        </g>
        <circle cx="196" cy="1882" r="38" fill="#7b8696" stroke={OUTLINE} strokeWidth="6" />
        <circle cx="196" cy="1882" r="12" fill="#12151f" />
        <rect x="244" y="1796" width="520" height="92" rx="42" fill="#e0aa40" stroke={OUTLINE} strokeWidth={SW} />
        <path d="M 262,1806 V1878 M 296,1804 V1880" stroke="#b5832a" strokeWidth="6" />
        <path d="M 335,1738 L 800,1732 L 790,1796 L 350,1804 Z" fill="#6c7686" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 268,1604 L 342,1526 L 692,1518 Q 770,1560 848,1624 L 838,1736 L 330,1744 Z" fill="url(#rover-lid)" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 384,1620 L 824,1612 L 802,1722 L 346,1732 Z" fill="#cdd4de" stroke="#6c7686" strokeWidth="6" strokeLinejoin="round" />
        <path d="M 462,1552 H620 M 458,1574 H620 M 454,1596 H618" stroke="#5d6676" strokeWidth="8" strokeLinecap="round" />
        <circle cx="528" cy="1532" r="9" fill="#5d6676" />

        <rect x="176" y="1398" width="42" height="112" rx="12" fill="#6c7686" stroke={OUTLINE} strokeWidth="7" />
        <rect x="788" y="1380" width="42" height="130" rx="12" fill="#6c7686" stroke={OUTLINE} strokeWidth="7" />
        <rect x="190" y="1424" width="640" height="52" rx="26" fill="#8d97a6" stroke={OUTLINE} strokeWidth={SW} />
        <path d="M 366,1284 L 662,1262 L 674,1382 L 376,1400 Z" fill="#12151f" stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 388,1300 L 640,1282" stroke="#2b3347" strokeWidth="8" strokeLinecap="round" />
        {([[145, 1355], [265, 1376], [745, 1346], [860, 1326]] as const).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="54" fill="#4a5160" stroke={OUTLINE} strokeWidth="7" />
            <circle cx={x} cy={y} r="35" fill="#d8f0fb" stroke="#8ecae6" strokeWidth="4" />
            <circle cx={x - 9} cy={y - 10} r="9" fill="#fff" opacity="0.85" />
          </g>
        ))}
      </g>
    </svg>
  );
}
