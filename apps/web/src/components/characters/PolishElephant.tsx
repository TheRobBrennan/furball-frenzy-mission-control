// One of the Polish elephants as in the "suited up" photo: a seated gray plush facing the viewer, big
// floppy ears, a short trunk, and a white swm t-shirt, with a keyring on top. Drawn in a 40 by 46 box,
// original art.
export default function PolishElephant({ x, y, scale = 1, waving = false }: { x: number; y: number; scale?: number; waving?: boolean }) {
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
      <ellipse cx="35.5" cy="30" rx="4.5" ry="6" fill="#bfc4cc" className={waving ? "story-wave" : undefined} />
      <rect x="9" y="22" width="22" height="17" rx="6" fill="#f2f4f8" />
      <text x="20" y="33.5" textAnchor="middle" fontSize="6" fontWeight="800" fill="#2646c8" fontFamily="Arial, Helvetica, sans-serif" stroke="none">
        swm
      </text>
      <circle cx="20" cy="13" r="10" fill="#bfc4cc" />
      <ellipse cx="20" cy="19" rx="4" ry="5.5" fill="#a9afb9" />
      <circle cx="15.5" cy="11" r="1.3" fill="#060f33" stroke="none" />
      <circle cx="24.5" cy="11" r="1.3" fill="#060f33" stroke="none" />
    </g>
  );
}
