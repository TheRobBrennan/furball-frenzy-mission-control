import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  children?: ReactNode;
  align?: "center" | "left";
  id?: string;
};

// The opening of a chapter: an auto-numbered "Mission log" label, a heading, and a short amber
// rule. The number comes from a CSS counter, so reordering sections never leaves a wrong number.
export default function SectionHeading({ eyebrow, title, children, align = "center", id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <header className={centered ? "text-left sm:text-center" : "text-left"}>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-amber sm:text-xs">
        <span className="chapter-label" aria-hidden="true" /> &middot; {eyebrow}
      </p>
      {title && (
        <h2 id={id} className="mt-3 text-3xl font-black text-balance sm:text-4xl">
          {title}
        </h2>
      )}
      <span
        aria-hidden="true"
        className={`chapter-rule mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-amber to-ember ${centered ? "sm:mx-auto" : ""}`}
      />
      {children && (
        <div className={`mt-5 max-w-2xl text-base text-pretty text-white/80 sm:text-lg ${centered ? "sm:mx-auto" : ""}`}>
          {children}
        </div>
      )}
    </header>
  );
}
