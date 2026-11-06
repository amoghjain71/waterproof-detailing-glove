"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, track } from "@/lib/track";

export function SiteTracking() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    if (pathname === "/" || pathname === "/glove") {
      track("view_item", { item: "glove" });
    }
  }, [pathname]);

  useEffect(() => {
    let sent = false;
    const onScroll = () => {
      if (sent) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= 0.5) {
        sent = true;
        track("scroll_depth_50");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
