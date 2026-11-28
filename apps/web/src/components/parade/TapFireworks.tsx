"use client";

import { useEffect, useRef, useState } from "react";

const colors = ["#fbbf24", "#f472b6", "#38bdf8", "#34d399", "#f87171", "#ffffff"];
const sparks = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const reach = 55 + ((i * 37) % 60);
  return { x: Math.round(Math.cos(angle) * reach), y: Math.round(Math.sin(angle) * reach), color: colors[i % colors.length] };
});

/** A firework of confetti wherever the visitor taps or clicks. Buttons and links keep their own job. */
export default function TapFireworks({ onTap }: { onTap?: () => void }) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const count = useRef(0);
  const tap = useRef(onTap);
  useEffect(() => {
    tap.current = onTap;
  });
  useEffect(() => {
    const burst = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest?.("a, nav, input, [data-no-fireworks]")) return;
      const button = target.closest?.("button");
      if (button && !button.hasAttribute("data-cheer")) return;
      // A keyboard press has no place of its own, so it goes off over the middle of what was pressed.
      const box = target.getBoundingClientRect();
      const keyboard = event.detail === 0;
      const id = ++count.current;
      setBursts((all) => [...all.slice(-5), { id, x: keyboard ? box.left + box.width / 2 : event.clientX, y: keyboard ? box.top + box.height / 2 : event.clientY }]);
      tap.current?.();
      window.setTimeout(() => setBursts((all) => all.filter((b) => b.id !== id)), 1200);
    };
    document.addEventListener("click", burst);
    return () => document.removeEventListener("click", burst);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bursts.map((b) => (
        <div key={b.id} data-testid="firework" className="absolute" style={{ left: b.x, top: b.y }}>
          {sparks.map((s, i) => (
            <span key={i} className="parade-burst" style={{ background: s.color, "--x": `${s.x}px`, "--y": `${s.y}px` } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  );
}
