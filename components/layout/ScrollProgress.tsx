"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-white/5"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-accent"
        style={{
          transform: `scaleX(${progress})`,
          transition: reduced ? undefined : "transform 80ms linear",
        }}
      />
    </div>
  );
}
