import type { ReactNode } from "react";

// A link out to the real thing a sentence mentions. It opens in a new tab, and it reads as a link
// without shouting, so the story still flows.
export default function ExtLink({
  href,
  children,
  onLight = false,
}: {
  href: string;
  children: ReactNode;
  onLight?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
        onLight
          ? "decoration-space/50 hover:decoration-space hover:text-space-2"
          : "decoration-white/40 hover:decoration-amber hover:text-amber"
      }`}
    >
      {children}
    </a>
  );
}
