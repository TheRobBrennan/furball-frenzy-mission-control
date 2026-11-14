// A stitched mission patch, like the ones on a flight suit. Pure SVG, decorative only. No NASA or
// agency artwork, the Space Apps text is just words.
export default function MissionPatch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <path id="patch-top" d="M 16,60 A 44,44 0 0 1 104,60" />
        <path id="patch-bottom" d="M 12,60 A 48,48 0 0 0 108,60" />
        <radialGradient id="patch-sky" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2b4a9a" />
          <stop offset="100%" stopColor="#0b1230" />
        </radialGradient>
      </defs>
      {/* the patch, with a stitched border */}
      <circle cx="60" cy="60" r="58" fill="#0b1230" stroke="#ffb703" strokeWidth="3" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#ffb703" strokeWidth="1" strokeDasharray="3 2.5" opacity="0.9" />
      <circle cx="60" cy="60" r="33" fill="url(#patch-sky)" stroke="#8ecae6" strokeWidth="1.5" />
      {/* lettering on the rim */}
      <text fill="#ffb703" fontSize="9.5" fontWeight="800" letterSpacing="2.2" fontFamily="var(--font-geist-mono), monospace">
        <textPath href="#patch-top" startOffset="50%" textAnchor="middle">
          FURBALL FRENZY
        </textPath>
      </text>
      <text fill="#8ecae6" fontSize="8.5" fontWeight="700" letterSpacing="2.4" fontFamily="var(--font-geist-mono), monospace">
        <textPath href="#patch-bottom" startOffset="50%" textAnchor="middle">
          SPACE APPS 2026
        </textPath>
      </text>
      {/* crescent moon */}
      <path d="M 70,40 A 15,15 0 1 0 82,62 A 12,12 0 1 1 70,40 Z" fill="#f1f5ff" opacity="0.95" />
      {/* a rocket climbing toward it */}
      <g transform="rotate(35 54 66)">
        <path d="M 54,44 C 60,52 60,66 58,74 L 50,74 C 48,66 48,52 54,44 Z" fill="#f1f5ff" />
        <circle cx="54" cy="58" r="3" fill="#8ecae6" stroke="#0b1230" strokeWidth="1" />
        <path d="M 50,70 L 44,78 L 50,76 Z M 58,70 L 64,78 L 58,76 Z" fill="#fb5607" />
        <path d="M 51,76 C 52,84 56,84 57,76 Z" fill="#ffb703" />
      </g>
      {/* stars */}
      <g fill="#ffb703">
        <path d="M 42,42 l 1.4,3 l 3.2,0.4 l -2.4,2.2 l 0.7,3.2 l -2.9,-1.7 l -2.9,1.7 l 0.7,-3.2 l -2.4,-2.2 l 3.2,-0.4 Z" transform="scale(0.8) translate(14 10)" />
        <circle cx="78" cy="76" r="1.6" />
        <circle cx="46" cy="82" r="1.2" />
        <circle cx="74" cy="48" r="1" />
      </g>
    </svg>
  );
}
