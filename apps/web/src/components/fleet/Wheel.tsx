// One wheel, drawn around its own center. The rim group turns when the vehicle is hovered or has
// focus, see .fleet-wheel in globals.css.
type WheelProps = {
  cx: number;
  cy: number;
  r: number;
  rim: string;
  spoke: string;
  spokes?: number;
  knobs?: number; // chunky tread blocks, for off-road tires
};

export default function Wheel({ cx, cy, r, rim, spoke, spokes = 5, knobs = 0 }: WheelProps) {
  const rimR = r * 0.64;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0a0f1c" stroke="#050816" strokeWidth="2" />
      <g className="fleet-wheel">
        {Array.from({ length: knobs }, (_, i) => (
          <rect
            key={`k${i}`}
            x={cx - r * 0.11}
            y={cy - r - r * 0.06}
            width={r * 0.22}
            height={r * 0.26}
            rx={r * 0.05}
            fill="#1b2233"
            stroke="#050816"
            strokeWidth="1"
            transform={`rotate(${(i * 360) / knobs} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={rimR} fill={rim} stroke="#050816" strokeWidth="1.5" />
        {Array.from({ length: spokes }, (_, i) => {
          const a = (i * 360) / spokes;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy - rimR * 0.2} L ${cx} ${cy - rimR * 0.86}`}
              stroke={spoke}
              strokeWidth={r * 0.2}
              strokeLinecap="round"
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={rimR * 0.2} fill="#0a0f1c" />
      </g>
    </g>
  );
}
