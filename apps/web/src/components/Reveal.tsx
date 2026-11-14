"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  as?: "section" | "div";
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

// Eases a block in as it scrolls into view. It is built so nothing is ever hidden by surprise:
// the server renders it visible, so with no JavaScript nothing is lost. A block already on screen
// when the page loads is left alone, so there is no flash. Only blocks below the fold are armed,
// and with reduced motion nothing is armed at all.
export default function Reveal({ as = "section", className, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLElement>(null);
  const [state, setState] = useState<"visible" | "armed" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    // Only blocks below the fold are armed, and that can only be known in the browser.
    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (as === "div") {
    return (
      <div ref={ref} data-reveal={state} className={className} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <section ref={ref} data-reveal={state} className={className} {...rest}>
      {children}
    </section>
  );
}
