/** True when the visitor asked for less motion. Safe to call where matchMedia does not exist, such as tests. */
export function reducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
