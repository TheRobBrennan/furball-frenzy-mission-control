"use client";

import { useEffect, useRef } from "react";
import type { SceneKind } from "@/lib/mission";
import LunarRover from "@/components/fleet/LunarRover";

type Props = { kind: SceneKind; mood: "cheer" | "worry" | "learn"; beam?: number; countText?: string; animate: boolean; speed?: number; paused?: boolean };

const stars = Array.from({ length: 26 }, (_, i) => ({ x: (i * 53 + 17) % 400, y: (i * 37 + 9) % 150, r: i % 5 === 0 ? 1.6 : 0.9 }));

function Sky() {
  return (
    <>
      <rect width="400" height="240" fill="url(#sky)" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.4 + (i % 3) * 0.2} />
      ))}
    </>
  );
}

const Moonscape = () => (
  <>
    <path d="M 0,186 Q 120,166 230,184 T 400,178 V 240 H 0 Z" fill="#8c93a3" />
    <path d="M 0,206 Q 140,190 260,204 T 400,200 V 240 H 0 Z" fill="#6e7586" />
    <ellipse cx="86" cy="214" rx="34" ry="7" fill="#585e6f" />
    <ellipse cx="318" cy="222" rx="26" ry="5.5" fill="#585e6f" />
  </>
);

function Earth({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#2a6fd6" stroke="#0a1a4a" strokeWidth="1.5" />
      <path d={`M ${x - r * 0.6},${y - r * 0.2} q ${r * 0.4},-${r * 0.5} ${r * 0.7},-${r * 0.1} q -${r * 0.1},${r * 0.5} -${r * 0.4},${r * 0.7} z`} fill="#4caf6a" />
      <path d={`M ${x + r * 0.1},${y + r * 0.3} q ${r * 0.5},-${r * 0.2} ${r * 0.6},${r * 0.2} q -${r * 0.3},${r * 0.4} -${r * 0.6},${r * 0.1} z`} fill="#4caf6a" />
    </g>
  );
}

function Rocket({ animate, x = 200 }: { animate: boolean; x?: number }) {
  return (
    <g transform={`translate(${x},0)`}>
      <g className={animate ? "story-liftoff" : ""}>
        <path d="M 0,100 C 12,118 14,146 12,172 H -12 C -14,146 -12,118 0,100 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="0" cy="130" r="6" fill="#8ecae6" stroke="#060f33" strokeWidth="2" />
        <path d="M -12,156 L -24,184 L -10,176 Z M 12,156 L 24,184 L 10,176 Z" fill="#fb5607" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
        <path d="M -7,176 H 7 L 0,206 Z" fill="#ffb703" stroke="#fb5607" strokeWidth="2" strokeLinejoin="round" className={animate ? "story-flame" : ""} />
      </g>
    </g>
  );
}

export default function SceneArt({ kind, mood, beam = 1, countText, animate, speed = 1, paused = false }: Props) {
  // The drifting spacecraft is a built-in SVG animation, which has its own pause.
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (paused) svg.current?.pauseAnimations?.();
    else svg.current?.unpauseAnimations?.();
  }, [paused]);
  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-space" data-testid={`scene-${kind}`}>
      <svg ref={svg} viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#030616" />
            <stop offset="1" stopColor="#0f2260" />
          </linearGradient>
          <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10285c" />
            <stop offset="1" stopColor="#f0a35e" />
          </linearGradient>
          <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1230" />
            <stop offset="1" stopColor="#141d44" />
          </linearGradient>
        </defs>

        {kind === "control" && (
          <>
            <rect width="400" height="240" fill="url(#room)" />
            <rect x="70" y="20" width="260" height="110" rx="10" fill="#050816" stroke="#3f6bd0" strokeWidth="3" />
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M ${90 + i * 27},28 V 122`} stroke="#1c2d63" strokeWidth="1" />
            ))}
            <path d="M 78,75 H 322" stroke="#1c2d63" strokeWidth="1" />
            <path d="M 78,120 L 140,90 L 190,100 L 260,50 L 318,40" fill="none" stroke="#34d399" strokeWidth="2.5" className={animate ? "story-line" : ""} />
            <text x="200" y="88" textAnchor="middle" fontSize={(countText?.length ?? 0) > 2 ? 26 : 44} fontWeight="900" fill={mood === "worry" ? "#fb7185" : "#ffb703"} fontFamily="ui-monospace, monospace">
              {countText ?? ""}
            </text>
            <rect x="40" y="196" width="320" height="44" rx="8" fill="#1a2656" />
          </>
        )}

        {kind === "liftoff" && (
          <>
            <Sky />
            <rect x="0" y="200" width="400" height="40" fill="#1d2a2a" />
            <path d="M 262,200 V 96 M 250,200 V 110 M 250,110 H 262 M 250,140 H 262 M 250,170 H 262" stroke="#7c8aa8" strokeWidth="3" fill="none" />
            <Rocket animate={animate} />
            {animate && [0, 1, 2].map((i) => <ellipse key={i} cx={170 + i * 30} cy="204" rx="26" ry="9" fill="#cfd6e4" opacity="0.7" className="story-smoke" style={{ animationDelay: `${0.2 * i}s` }} />)}
          </>
        )}

        {kind === "transit" && (
          <>
            <Sky />
            <Earth x={64} y={170} r={36} />
            <circle cx="338" cy="64" r="22" fill="#b3b9c7" stroke="#0a1a4a" strokeWidth="1.5" />
            <circle cx="330" cy="58" r="4" fill="#9aa1b1" />
            <circle cx="346" cy="72" r="3" fill="#9aa1b1" />
            <path id="arc" d="M 100,150 Q 200,30 316,66" fill="none" stroke="#8ecae6" strokeWidth="1.5" strokeDasharray="4 5" />
            <g>
              <path d="M -8,0 L 8,0 L 0,-14 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="1.5" />
              <rect x="-18" y="-6" width="9" height="5" fill="#3f6bd0" />
              <rect x="9" y="-6" width="9" height="5" fill="#3f6bd0" />
              {animate ? <animateMotion dur={`${3 / speed}s`} fill="freeze" rotate="auto"><mpath href="#arc" /></animateMotion> : <animateTransform attributeName="transform" type="translate" values="200 70" dur="1s" fill="freeze" />}
            </g>
          </>
        )}

        {kind === "emergency" && (
          <>
            <Sky />
            <Earth x={64} y={190} r={30} />
            <g transform="translate(200 120)">
              <path d="M -16,0 L 16,0 L 0,-30 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" />
              <rect x="-36" y="-12" width="18" height="10" fill="#3f6bd0" />
              <rect x="18" y="-12" width="18" height="10" fill="#3f6bd0" />
              {mood === "worry" && <path d="M -6,-8 L 2,-2 L -2,4" fill="none" stroke="#fb7185" strokeWidth="2" />}
            </g>
            {mood === "worry" && animate && [0, 1, 2, 3].map((i) => <circle key={i} cx={330 - i * 18} cy={40 + i * 12} r="3" fill="#cbd5e1" className="story-debris" style={{ animationDelay: `${i * 0.4}s` }} />)}
            {mood === "worry" && <rect width="400" height="240" fill="#ef4444" className={animate ? "story-alert" : ""} opacity={animate ? undefined : 0.15} />}
            {mood === "cheer" && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={90 + i * 55} cy={40 + (i % 2) * 20} r="2" fill="#ffd166" className={animate ? "story-sparkle" : ""} style={{ animationDelay: `${i * 0.3}s` }} />)}
          </>
        )}

        {kind === "landing" && (
          <>
            <Sky />
            <Moonscape />
            <g className={animate ? "story-land" : ""}>
              <rect x="176" y="136" width="48" height="26" rx="6" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" />
              <path d="M 180,162 L 166,188 M 220,162 L 234,188 M 166,188 h -8 M 234,188 h 8" stroke="#060f33" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 192,162 H 208 L 200,182 Z" fill="#ffb703" className={animate ? "story-flame" : ""} />
            </g>
            {animate && [0, 1, 2].map((i) => <ellipse key={i} cx={150 + i * 50} cy="190" rx="22" ry="6" fill="#b9bfcd" opacity="0.7" className="story-dust" style={{ animationDelay: `${2 + 0.1 * i}s` }} />)}
          </>
        )}

        {(kind === "surface" || kind === "joyride") && (
          <>
            <Sky />
            <Earth x={346} y={52} r={22} />
            <Moonscape />
          </>
        )}

        {kind === "surface" && (
          <>
            <path
              d="M 200,150 L 346,52"
              stroke="#34d399"
              strokeLinecap="round"
              fill="none"
              strokeWidth={1.5 + 6 * beam}
              strokeDasharray="6 8"
              opacity={0.25 + 0.75 * beam}
              className={animate ? "story-beam" : ""}
              data-testid="data-beam"
            />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d="M 0,-5 L 1.4,-1.4 L 5,0 L 1.4,1.4 L 0,5 L -1.4,1.4 L -5,0 L -1.4,-1.4 Z" fill="#ffd23f" transform={`translate(${170 + i * 22},150)`} className={animate && mood === "cheer" ? "story-sparkle" : "opacity-0"} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </>
        )}

        {kind === "joyride" && (
          <>
            <path d="M 356,186 V 150" stroke="#cfd6e4" strokeWidth="2" />
            <path d="M 356,150 L 378,157 L 356,164 Z" fill="#ffb703" stroke="#060f33" strokeWidth="1" />
          </>
        )}

        {(kind === "splashdown" || kind === "recovery") && (
          <>
            <rect width="400" height="240" fill="url(#dawn)" />
            <circle cx="330" cy="140" r="26" fill="#ffd23f" opacity="0.95" />
            <ellipse cx="90" cy="52" rx="38" ry="10" fill="#fff" opacity="0.35" />
            <ellipse cx="300" cy="40" rx="30" ry="8" fill="#fff" opacity="0.3" />
            <path d="M 0,168 Q 50,158 100,168 T 200,168 T 300,168 T 400,168 V 240 H 0 Z" fill="#1f5fae" />
            <path d="M 0,190 Q 60,180 120,190 T 240,190 T 360,190 T 480,190 V 240 H 0 Z" fill="#194f95" />
          </>
        )}

        {kind === "splashdown" && (
          <>
            <g className={animate ? "story-fall" : ""} transform={animate ? undefined : "translate(0,50)"}>
              <g className={animate ? "story-sway" : ""}>
                <path d="M 150,56 Q 200,-14 250,56 Z" fill="#fb5607" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 118,76 Q 148,32 176,76 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 224,76 Q 252,32 282,76 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 150,56 L 198,120 M 250,56 L 202,120 M 118,76 L 196,120 M 282,76 L 204,120" stroke="#060f33" strokeWidth="1.2" fill="none" />
              </g>
              <path d="M 190,118 H 210 L 216,138 H 184 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="200" cy="127" r="3.5" fill="#8ecae6" stroke="#060f33" strokeWidth="1.5" />
            </g>
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx="200" cy="198" rx="22" ry="5" fill="none" stroke="#e6f1ff" strokeWidth="2" opacity="0" className={animate ? "story-ripple" : ""} style={{ animationDelay: `calc(${2.8 + i * 0.35}s / var(--story-speed, 1))` }} />
            ))}
          </>
        )}

        {kind === "recovery" && (
          <>
            <path d="M 36,176 H 214 L 194,208 H 56 Z" fill="#cfd6e4" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
            <rect x="92" y="146" width="56" height="30" rx="3" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" />
            <rect x="104" y="128" width="14" height="18" fill="#d6252b" stroke="#060f33" strokeWidth="2" />
            <path d="M 150,146 V 118 L 172,126 L 150,134" fill="#ffb703" stroke="#060f33" strokeWidth="1.5" strokeLinejoin="round" />
            {[100, 118, 136].map((x) => (
              <rect key={x} x={x - 4} y="156" width="8" height="8" fill="#8ecae6" stroke="#060f33" strokeWidth="1.2" />
            ))}
            <g className={animate ? "story-bob" : ""}>
              <path d="M 254,184 H 286 L 292,202 H 248 Z" fill="#f2f4f8" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="270" cy="193" r="4" fill="#8ecae6" stroke="#060f33" strokeWidth="1.5" />
              <path d="M 256,184 Q 270,170 284,184" fill="#fb5607" stroke="#060f33" strokeWidth="2" />
            </g>
            <g transform="translate(330,62)">
              <ellipse cx="0" cy="0" rx="20" ry="9" fill="#d6252b" stroke="#060f33" strokeWidth="2" />
              <path d="M -20,-2 L -38,-8 L -38,2 Z" fill="#d6252b" stroke="#060f33" strokeWidth="2" strokeLinejoin="round" />
              <line x1="-26" y1="-13" x2="26" y2="-13" stroke="#060f33" strokeWidth="3" strokeLinecap="round" className={animate ? "story-rotor" : ""} />
              <line x1="0" y1="-9" x2="0" y2="-13" stroke="#060f33" strokeWidth="2" />
            </g>
          </>
        )}

        {kind === "wrap" && (
          <>
            <rect width="400" height="240" fill="url(#sky)" />
            {mood === "cheer"
              ? Array.from({ length: 22 }, (_, i) => (
                  <rect key={i} x={(i * 41) % 400} y={-10} width="6" height="10" fill={["#ffb703", "#fb5607", "#8ecae6", "#34d399", "#f472b6"][i % 5]} className={animate ? "story-confetti" : ""} style={{ animationDelay: `${(i % 7) * 0.25}s`, transform: animate ? undefined : `translateY(${30 + (i % 9) * 18}px)` }} />
                ))
              : (
                <g transform="translate(200,86)" className={animate ? "story-bulb" : ""}>
                  <circle cx="0" cy="0" r="30" fill="#ffd23f" stroke="#060f33" strokeWidth="2.5" />
                  <path d="M -12,26 H 12 V 40 H -12 Z" fill="#9aa1b1" stroke="#060f33" strokeWidth="2.5" />
                  <path d="M -8,-4 Q 0,14 8,-4" fill="none" stroke="#060f33" strokeWidth="2.5" />
                </g>
              )}
          </>
        )}
      </svg>

      {kind === "surface" && (
        <div className="absolute bottom-[8%] left-1/2 w-[17%] -translate-x-1/2">
          <LunarRover className={`h-auto w-full ${animate && mood === "cheer" ? "story-hum" : ""} ${mood === "worry" ? "opacity-60" : ""}`} />
        </div>
      )}
      {kind === "joyride" && (
        <div className={`absolute bottom-[6%] left-[14%] w-[17%] ${animate ? "story-drive" : "left-[40%]"}`}>
          <LunarRover className={`h-auto w-full ${animate ? "story-bounce" : ""}`} />
        </div>
      )}
      {kind === "joyride" && animate && [0, 1, 2, 3].map((i) => <span key={i} className="story-puff absolute bottom-[7%] block h-3 w-3 rounded-full bg-white/50" style={{ left: `${20 + i * 9}%`, animationDelay: `${i * 0.6}s` }} />)}
    </div>
  );
}
