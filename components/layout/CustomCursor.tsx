"use client";

import { useEffect, useRef } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/reduced-motion";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || touch) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced, touch]);

  if (reduced || touch) return null;

  // z-300 keeps the cursor above cart/drawers (120) and lightbox (130)
  return (
    <div
      className="pointer-events-none fixed inset-0 z-overlay hidden md:block"
      aria-hidden
    >
      <div ref={dotRef} className="absolute h-1.5 w-1.5 rounded bg-ink" />
    </div>
  );
}
