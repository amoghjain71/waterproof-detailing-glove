"use client";

import { useEffect, useRef } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/reduced-motion";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const dotRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || touch) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      const vx = x - px;
      const vy = y - py;
      const speed = Math.min(Math.hypot(vx, vy), 40);
      px = x;
      py = y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }
      if (dropRef.current) {
        const squash = 1 + speed * 0.02;
        const squish = 1 - speed * 0.012;
        dropRef.current.style.transform = `translate3d(${x - 10}px, ${y - 14}px, 0) scale(${squash}, ${squish})`;
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
      className="pointer-events-none fixed inset-0 z-[300] hidden md:block"
      aria-hidden
    >
      <div
        ref={dotRef}
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan"
      />
      <div
        ref={dropRef}
        className="absolute h-5 w-3.5"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(127,214,255,0.95), rgba(31,123,255,0.55) 55%, transparent 72%)",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          opacity: 0.75,
        }}
      />
    </div>
  );
}
