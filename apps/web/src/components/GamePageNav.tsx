"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { rememberFolded, sectionTabs } from "@/lib/folderTabs";
import GameSettings from "./GameSettings";

const tabs = [
  { href: "/", label: "Cover", color: "border-t-[#f472b6]" },
  { href: "/missions", label: "Missions", color: "border-t-amber" },
];

/** The game pages' top bar, the same slim folder tabs as the home page. */
export default function GamePageNav() {
  const pathname = usePathname();
  const folding = pathname === "/missions";
  useEffect(() => {
    if (folding) rememberFolded(true);
  }, [folding]);
  return (
    <nav aria-label="Main navigation" className="border-b border-white/10 bg-space/85">
      <div className="mx-auto flex max-w-6xl items-end gap-2 px-4 pt-2 sm:px-6">
        <Link href="/" className="mr-auto inline-flex min-h-11 items-center font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber focus-visible:outline-2 focus-visible:outline-amber">
          <span>
            Furball<span className="hidden sm:inline"> Frenzy</span>
          </span>
        </Link>
        <ul className="flex items-end gap-1">
          {tabs.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={pathname === t.href ? "page" : undefined}
                className={`block rounded-t-lg border border-b-0 border-t-4 border-white/10 px-3 py-2 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber sm:px-4 ${t.color} ${
                  pathname === t.href ? "bg-amber text-space" : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
          {/* Only for the eye: the home page's tabs, folding away. Wide screens only, like the home page. */}
          {folding &&
            sectionTabs.map((t, i) => (
              <li key={t.id} aria-hidden="true" data-testid="folding-tab" className="tab-fold hidden lg:block" style={{ animationDelay: `${(sectionTabs.length - 1 - i) * 0.18}s` }}>
                <span className={`block whitespace-nowrap rounded-t-lg border border-b-0 border-t-4 border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 ${t.color}`}>{t.label}</span>
              </li>
            ))}
        </ul>
        <GameSettings />
      </div>
    </nav>
  );
}
