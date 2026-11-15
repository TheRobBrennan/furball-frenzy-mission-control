import type { Mood, Who } from "@/lib/mission";
import PolishElephant from "./PolishElephant";

// The cast of the mission story, small original SVG portraits in the spirit of the plush crew. Each is
// drawn in a 60 by 60 box. The mood changes the mouth, and a worried furball gets a sweat drop.
const INK = "#0a1a4a";

function Mouth({ mood }: { mood: Mood }) {
  if (mood === "cheer") return <path d="M 24,40 Q 30,47 36,40" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />;
  if (mood === "worry") return <path d="M 24,44 Q 28,40 30,44 T 36,44" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />;
  return <path d="M 25,42 H 35" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />;
}

const Sweat = ({ mood }: { mood: Mood }) => (mood === "worry" ? <path d="M 46,16 Q 49,22 46,24 Q 43,22 46,16 Z" fill="#8ecae6" stroke={INK} strokeWidth="0.8" /> : null);

function Eyes({ y = 31 }: { y?: number }) {
  return (
    <>
      <circle cx="23.5" cy={y} r="2.2" fill={INK} />
      <circle cx="36.5" cy={y} r="2.2" fill={INK} />
      <circle cx="24.2" cy={y - 0.8} r="0.7" fill="#fff" />
      <circle cx="37.2" cy={y - 0.8} r="0.7" fill="#fff" />
    </>
  );
}

function Piggy({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <path d="M 14,22 L 10,8 L 24,14 Z M 46,22 L 50,8 L 36,14 Z" fill="#ee8aa4" />
      <circle cx="30" cy="32" r="18" fill="#f4a6b7" />
      <ellipse cx="30" cy="38" rx="8" ry="6" fill="#f08aa3" />
      <circle cx="27.5" cy="38" r="1.2" fill={INK} stroke="none" />
      <circle cx="32.5" cy="38" r="1.2" fill={INK} stroke="none" />
      <Eyes />
      <path d="M 12,24 Q 30,2 48,24 L 46,28 Q 30,16 14,28 Z" fill="#7b4a2a" />
      <circle cx="22" cy="14" r="4" fill="#8ecae6" stroke="#f2b705" strokeWidth="1.6" />
      <circle cx="38" cy="14" r="4" fill="#8ecae6" stroke="#f2b705" strokeWidth="1.6" />
      <Sweat mood={mood} />
    </g>
  );
}

function Hamley({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <path d="M 16,24 L 13,12 L 25,17 Z M 44,24 L 47,12 L 35,17 Z" fill="#f2a9ba" />
      <circle cx="30" cy="33" r="16" fill="#f7c1cd" />
      <ellipse cx="30" cy="39" rx="7" ry="5" fill="#f2a9ba" />
      <circle cx="27.8" cy="39" r="1" fill={INK} stroke="none" />
      <circle cx="32.2" cy="39" r="1" fill={INK} stroke="none" />
      <Eyes y={32} />
      <path d="M 13,32 Q 13,14 30,14 Q 47,14 47,32" fill="none" stroke="#2646c8" strokeWidth="2.4" />
      <rect x="9" y="28" width="6" height="9" rx="3" fill="#2646c8" />
      <path d="M 12,38 Q 14,46 24,46" fill="none" stroke="#2646c8" strokeWidth="1.6" />
      <Sweat mood={mood} />
    </g>
  );
}

function BlueBear({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <circle cx="14" cy="16" r="7" fill="#3f6bd0" />
      <circle cx="46" cy="16" r="7" fill="#3f6bd0" />
      <circle cx="30" cy="32" r="18" fill="#4a78d4" />
      <ellipse cx="30" cy="38" rx="9" ry="7" fill="#9fc0f5" />
      <ellipse cx="30" cy="35" rx="3" ry="2.2" fill={INK} />
      <Eyes />
      <Mouth mood={mood} />
      <Sweat mood={mood} />
    </g>
  );
}

// Little Bear, the fluffy beige teddy in the red knit sweater with the white collar.
function LittleBear({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <path d="M 8,60 Q 10,44 30,44 Q 50,44 52,60 Z" fill="#d6252b" />
      <path d="M 18,46 Q 30,54 42,46 L 44,52 Q 30,60 16,52 Z" fill="#f3ead8" />
      <circle cx="13" cy="15" r="7" fill="#c9b49b" />
      <circle cx="47" cy="15" r="7" fill="#c9b49b" />
      <circle cx="30" cy="29" r="18" fill="#d8c6ad" />
      <ellipse cx="30" cy="35" rx="9" ry="7" fill="#f0e3cd" />
      <ellipse cx="30" cy="32.5" rx="3" ry="2.2" fill="#4a3426" />
      <Eyes y={27} />
      <path d="M 25,38 Q 30,42 35,38" fill="none" stroke="#4a3426" strokeWidth="1.4" strokeLinecap="round" />
      <Sweat mood={mood} />
    </g>
  );
}

function LittleDuck({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <circle cx="30" cy="30" r="19" fill="#ffd23f" />
      <path d="M 18,37 Q 30,32 42,37 Q 30,48 18,37 Z" fill="#fb5607" />
      <Eyes y={26} />
      <path d="M 26,16 Q 30,6 34,16" fill="none" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
      <Sweat mood={mood} />
    </g>
  );
}

// The Gray Elephant, the larger gray elephant of the North Carolina crew: big floppy ears, a long trunk, no shirt.
function GrayElephant({ mood }: { mood: Mood }) {
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="9" cy="30" rx="9" ry="14" fill="#9aa3ae" />
      <ellipse cx="51" cy="30" rx="9" ry="14" fill="#9aa3ae" />
      <ellipse cx="10" cy="30" rx="4.5" ry="9" fill="#bcc3cc" strokeWidth="0.6" />
      <ellipse cx="50" cy="30" rx="4.5" ry="9" fill="#bcc3cc" strokeWidth="0.6" />
      <circle cx="30" cy="28" r="17" fill="#aeb6c0" />
      <path d="M 25,38 Q 22,52 30,56 Q 38,52 35,38 Z" fill="#aeb6c0" />
      <path d="M 24,40 L 20,47 M 36,40 L 40,47" stroke="#f3ead8" strokeWidth="2.4" />
      <Eyes y={27} />
      <Sweat mood={mood} />
    </g>
  );
}

const portraits = { "gray-elephant": GrayElephant, piggy: Piggy, hamley: Hamley, "blue-bear": BlueBear, "little-bear": LittleBear, "little-duck": LittleDuck } as const;

/** A character portrait. The Polish elephants are a seated pair, wider than the others. */
export default function Furball({ who, mood = "cheer", label, className = "h-16 w-16", waving = false }: { who: Who; mood?: Mood; label: string; className?: string; waving?: boolean }) {
  if (who === "elephants") {
    return (
      <svg viewBox="0 0 90 50" role="img" aria-label={label} className={className.replace("w-16", "w-28")}>
        <PolishElephant x={2} y={2} scale={1} waving={waving} />
        <PolishElephant x={48} y={2} scale={1} waving={waving} />
      </svg>
    );
  }
  const Portrait = portraits[who];
  return (
    <svg viewBox="0 0 60 60" role="img" aria-label={label} className={className}>
      <Portrait mood={mood} />
    </svg>
  );
}
