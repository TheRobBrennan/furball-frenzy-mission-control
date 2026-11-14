import Wheel from "./Wheel";

// Mis' Adventure, the RV: a cream Class C motorhome with a cab-over bunk, navy, slate, and mauve
// swoosh stripes, a big picture window, a ladder up the back, and the name in script on the side.
// An original drawing, no maker badges, no plate, no owners.
const BOX =
  "M 22,146 L 22,40 Q 22,34 28,34 L 360,34 Q 368,34 368,42 L 368,84 L 306,84 L 306,146 Z";
const CAB =
  "M 306,146 L 306,84 L 336,84 L 356,106 L 388,112 Q 398,114 398,126 L 398,146 Z";

export default function MisAdventure() {
  return (
    <svg viewBox="0 24 410 156" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Mis' Adventure, a cream motorhome with navy swoosh stripes and a big window" className="h-full w-full">
      <defs>
        <clipPath id="rv-clip">
          <path d={BOX} />
          <path d={CAB} />
        </clipPath>
        <linearGradient id="rv-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4f6b" />
          <stop offset="1" stopColor="#16223a" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="172" rx="190" ry="7" fill="#000" opacity="0.35" />
      <g className="fleet-body">
        {/* ladder up the back */}
        <path d="M 10,44 V142 M 22,44 V142" stroke="#aab3bf" strokeWidth="3" strokeLinecap="round" />
        <path d="M 10,56 H22 M 10,72 H22 M 10,88 H22 M 10,104 H22 M 10,120 H22 M 10,136 H22" stroke="#aab3bf" strokeWidth="2.5" />
        {/* the box and the cab */}
        <path d={BOX} fill="#f3ecd8" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <path d={CAB} fill="#f6f0df" stroke="#050816" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#rv-clip)">
          {/* shadow along the bottom, under-floor storage bays */}
          <rect x="20" y="128" width="290" height="20" fill="#d9cfb5" />
          <path d="M 70,128 V146 M 140,128 V146 M 214,128 V146 M 270,128 V146" stroke="#b9ad8f" strokeWidth="2" />
          {/* the swoosh stripes: navy, mauve, and slate */}
          <path d="M 20,58 L 306,58 L 306,66 L 20,66 Z" fill="#1d2a4a" />
          <path d="M 20,69 L 306,69 L 306,73 L 20,73 Z" fill="#a58a86" />
          <path d="M 20,119 L 306,119 L 306,126 L 20,126 Z" fill="#1d2a4a" />
          <path d="M 28,126 Q 52,98 126,102 Q 80,108 56,132 Z" fill="#4a6a86" />
          <path d="M 34,126 Q 58,106 118,108 Q 82,114 62,134 Z" fill="#7c6e69" opacity="0.9" />
          <path d="M 306,100 L 398,106" stroke="#a58a86" strokeWidth="3" />
          {/* wheel wells */}
          <circle cx="104" cy="143" r="35" fill="#1a1a22" />
          <circle cx="330" cy="143" r="35" fill="#1a1a22" />
        </g>
        {/* the cab-over bunk window and the cab glass */}
        <rect x="318" y="50" width="38" height="24" rx="6" fill="url(#rv-glass)" stroke="#050816" strokeWidth="2.5" />
        <path d="M 312,90 L 334,90 L 350,108 L 312,108 Z" fill="url(#rv-glass)" stroke="#050816" strokeWidth="2.5" strokeLinejoin="round" />
        {/* the big picture window */}
        <rect x="146" y="70" width="112" height="28" rx="8" fill="url(#rv-glass)" stroke="#050816" strokeWidth="3" />
        <path d="M 202,70 V98 M 202,86 H258" stroke="#050816" strokeWidth="2.5" />
        <path d="M 156,76 L 172,76 L 160,90 Z" fill="#fff" opacity="0.2" />
        {/* a small rear window and the door */}
        <rect x="34" y="76" width="34" height="22" rx="6" fill="url(#rv-glass)" stroke="#050816" strokeWidth="2.5" />
        <rect x="270" y="76" width="30" height="48" rx="4" fill="#f6f0df" stroke="#050816" strokeWidth="2.5" />
        <rect x="276" y="82" width="18" height="16" rx="3" fill="url(#rv-glass)" stroke="#050816" strokeWidth="2" />
        {/* the rolled-up awning along the roof edge */}
        <rect x="100" y="38" width="190" height="9" rx="4.5" fill="#fffaf0" stroke="#050816" strokeWidth="2" />
        {/* the name, in script */}
        <text
          x="148"
          y="113"
          fontSize="15"
          fontStyle="italic"
          fontWeight="700"
          fill="#0a0f1c"
          fontFamily="'Segoe Script','Bradley Hand','Brush Script MT','Snell Roundhand',cursive"
        >
          Mis&apos; Adventure
        </text>
        {/* lights, the grille, the bumper */}
        <path d="M 384,112 L 398,114 L 398,124 L 384,122 Z" fill="#ffe9a8" stroke="#050816" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 372,128 L 398,128 L 398,146 L 366,146 Z" fill="#cfd5dd" stroke="#050816" strokeWidth="2" />
        <rect x="22" y="40" width="6" height="12" rx="2" fill="#e63946" />
        <rect x="22" y="112" width="8" height="12" rx="2" fill="#e63946" />
        {/* a mud flap, the rear bumper */}
        <rect x="6" y="136" width="20" height="22" rx="2" fill="#1a1a22" stroke="#050816" strokeWidth="1.5" />
      </g>
      <Wheel cx={104} cy={143} r={28} rim="#dfe3e8" spoke="#9aa3ae" />
      <Wheel cx={330} cy={143} r={28} rim="#dfe3e8" spoke="#9aa3ae" />
    </svg>
  );
}
