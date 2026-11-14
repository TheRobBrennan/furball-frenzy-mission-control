// A propeller seen from above: a faint disc and two blades. The blades turn when the drone's card
// is hovered or pressed, see .fleet-wheel in globals.css.
type PropProps = { cx: number; cy: number; r: number; disc?: string; blade?: string };

export default function Prop({ cx, cy, r, disc = "#dbe3ee", blade = "#2b303a" }: PropProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={disc} fillOpacity="0.4" stroke={blade} strokeOpacity="0.35" strokeWidth="1.5" />
      <g className="fleet-wheel">
        <path d={`M ${cx - r * 0.92} ${cy} L ${cx + r * 0.92} ${cy}`} stroke={blade} strokeWidth={r * 0.16} strokeLinecap="round" />
        <path d={`M ${cx} ${cy - r * 0.35} L ${cx} ${cy + r * 0.35}`} stroke={blade} strokeWidth={r * 0.1} strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#0a0f1c" />
    </g>
  );
}
