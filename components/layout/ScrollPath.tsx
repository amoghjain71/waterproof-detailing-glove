"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

function snake(width: number, height: number) {
  const edge = Math.max(16, Math.min(40, width * 0.03));
  const reach = width > 800 ? width * 0.34 : Math.min(72, width * 0.18);
  const step = 440;
  let y = 80;
  let onEdge = true;
  let d = `M ${width - edge} 0`;

  while (y < height + step) {
    const y2 = Math.min(height, y);
    const from = onEdge ? width - edge : width - reach;
    const to = onEdge ? width - reach : width - edge;
    d += ` C ${from} ${y - step * 0.65}, ${to} ${y2 - step * 0.35}, ${to} ${y2}`;
    onEdge = !onEdge;
    if (y >= height) break;
    y += step;
  }

  return d;
}

export function ScrollPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    let frame = 0;

    const layout = () => {
      const width = document.documentElement.clientWidth;
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      path.setAttribute("d", snake(width, height));
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      return length;
    };

    let length = layout();

    const paint = () => {
      if (reduced) {
        path.style.strokeDashoffset = "0";
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      length = layout();
      paint();
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full"
      data-scroll-path
      aria-hidden
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeOpacity="0.28"
        strokeLinecap="square"
      />
    </svg>
  );
}
