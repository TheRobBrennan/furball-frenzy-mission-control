import Prop from "./Prop";

// Optimus, the DJI Air 2S: a bigger, darker gray drone with a large camera, seen from above. An
// original drawing, no logos.
export default function AirDrone() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Optimus, a larger dark gray drone with a big camera, seen from above" className="mx-auto h-full w-auto">
      <ellipse cx="100" cy="188" rx="54" ry="5" fill="#000" opacity="0.3" />
      <g className="fleet-body">
        <path d="M 88,90 L 40,50 M 112,90 L 160,50 M 88,114 L 42,152 M 112,114 L 158,152" stroke="#050816" strokeWidth="15" strokeLinecap="round" />
        <path d="M 88,90 L 40,50 M 112,90 L 160,50 M 88,114 L 42,152 M 112,114 L 158,152" stroke="#59616e" strokeWidth="10" strokeLinecap="round" />
        <Prop cx={40} cy={50} r={36} blade="#161a22" />
        <Prop cx={160} cy={50} r={36} blade="#161a22" />
        <Prop cx={42} cy={152} r={36} blade="#161a22" />
        <Prop cx={158} cy={152} r={36} blade="#161a22" />
        <rect x="78" y="76" width="44" height="66" rx="18" fill="#6b7482" stroke="#050816" strokeWidth="3" />
        <rect x="88" y="96" width="24" height="32" rx="9" fill="#4b5360" stroke="#050816" strokeWidth="2" />
        <circle cx="100" cy="74" r="13" fill="#1f242e" stroke="#050816" strokeWidth="3" />
        <circle cx="100" cy="74" r="7" fill="#0a0f1c" />
        <circle cx="98" cy="72" r="2.4" fill="#8ecae6" />
        <path d="M 84,140 H116" stroke="#fb5607" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
