"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { capturePageview, setAnalyticsEnabled } from "@/lib/analytics";

export default function AnalyticsPageviews() {
  const pathname = usePathname();
  const choice = useSearchParams().get("analytics");
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (choice === "off" || choice === "on") setAnalyticsEnabled(choice === "on");
    if (choice === "off") {
      lastPath.current = null;
      return;
    }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    capturePageview(pathname);
  }, [pathname, choice]);

  return null;
}
