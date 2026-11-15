// Two small elephants in white shirts. When the mood is sad they droop, their brows crumple, and
// tears roll. When it is happy they perk up. An original drawing, no logos.
export default function SadElephants({ mood }: { mood: "sad" | "happy" }) {
  const sad = mood === "sad";
  const one = (cx: number, delay: string) => (
    <g className={sad ? "elephant-sad" : ""} style={{ animationDelay: delay }}>
      {/* the shirt and shoulders */}
      <ellipse cx={cx} cy="104" rx="26" ry="16" fill="#f4f7fb" stroke="#050816" strokeWidth="2" />
      {/* ears */}
      <circle cx={cx - 27} cy="58" r="16" fill="#b9bfcb" stroke="#050816" strokeWidth="2" />
      <circle cx={cx - 27} cy="60" r="9" fill="#e7b7c4" />
      <circle cx={cx + 27} cy="58" r="16" fill="#b9bfcb" stroke="#050816" strokeWidth="2" />
      <circle cx={cx + 27} cy="60" r="9" fill="#e7b7c4" />
      {/* head and trunk, the trunk hangs low when sad */}
      <circle cx={cx} cy="60" r="27" fill="#c5cad5" stroke="#050816" strokeWidth="2" />
      <path
        className={sad ? "elephant-trunk" : ""}
        d={sad ? `M ${cx - 4},72 Q ${cx - 6},98 ${cx},102 Q ${cx + 6},98 ${cx + 4},72 Z` : `M ${cx - 6},72 Q ${cx - 10},88 ${cx - 2},94 Q ${cx + 8},90 ${cx + 6},72 Z`}
        fill="#c5cad5"
        stroke="#050816"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* big eyes, watery when sad: a wet rim, two shines, and a tear welling at the lid */}
      {sad && (
        <>
          <ellipse cx={cx - 10} cy="58" rx="10.5" ry="9.5" fill="#9fd8ff" fillOpacity="0.55" stroke="#6bb8ee" strokeWidth="1.2" />
          <ellipse cx={cx + 10} cy="58" rx="10.5" ry="9.5" fill="#9fd8ff" fillOpacity="0.55" stroke="#6bb8ee" strokeWidth="1.2" />
        </>
      )}
      <circle cx={cx - 10} cy="57" r={sad ? 7 : 4.2} fill="#050816" />
      <circle cx={cx + 10} cy="57" r={sad ? 7 : 4.2} fill="#050816" />
      <circle className={sad ? "eye-shine" : ""} cx={cx - 12} cy="54.5" r={sad ? 2.6 : 1.3} fill="#fff" />
      <circle className={sad ? "eye-shine" : ""} cx={cx + 8} cy="54.5" r={sad ? 2.6 : 1.3} fill="#fff" />
      {sad && (
        <>
          <circle cx={cx - 8} cy="60.5" r="1.3" fill="#fff" fillOpacity="0.8" />
          <circle cx={cx + 12} cy="60.5" r="1.3" fill="#fff" fillOpacity="0.8" />
          <path d={`M ${cx - 10},65 L ${cx - 10},73`} stroke="#7fc4f2" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          <path d={`M ${cx + 10},65 L ${cx + 10},73`} stroke="#7fc4f2" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        </>
      )}
      {sad ? (
        <>
          <path d={`M ${cx - 18},50 L ${cx - 5},42`} stroke="#050816" strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M ${cx + 18},50 L ${cx + 5},42`} stroke="#050816" strokeWidth="2.4" strokeLinecap="round" />
          <path className="quiver" d={`M ${cx - 7},76 Q ${cx},70 ${cx + 7},76`} fill="none" stroke="#050816" strokeWidth="2" strokeLinecap="round" />
          <path className="tear" d={`M ${cx - 10},66 q -4,8 0,11 q 4,-3 0,-11 z`} fill="#7fc4f2" />
          <path className="tear tear-2" d={`M ${cx + 10},66 q -4,8 0,11 q 4,-3 0,-11 z`} fill="#7fc4f2" />
        </>
      ) : (
        <>
          <path d={`M ${cx - 15},50 Q ${cx - 10},46 ${cx - 5},50`} fill="none" stroke="#050816" strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${cx + 15},50 Q ${cx + 10},46 ${cx + 5},50`} fill="none" stroke="#050816" strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${cx - 7},66 Q ${cx},72 ${cx + 7},66`} fill="none" stroke="#050816" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 240 124" role="img" aria-label={sad ? "Two sad elephants with tears rolling down" : "Two elephants smiling again"} className="mx-auto h-32 w-auto">
      {one(70, "0s")}
      {one(170, "0.5s")}
    </svg>
  );
}
