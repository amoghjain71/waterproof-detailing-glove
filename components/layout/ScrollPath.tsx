"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/reduced-motion";

type Point = { x: number; y: number };

function buildPath(points: Point[], width: number) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0]!;
    return `M ${p.x} ${p.y}`;
  }

  const swing = width * 0.1;
  const stackThreshold = width * 0.08;
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  let swingSign = 1;

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const dy = curr.y - prev.y;
    const dx = Math.abs(curr.x - prev.x);

    // Vertical tangents: control points share endpoint X so L/R hops curve smoothly.
    let c1x = prev.x;
    let c2x = curr.x;
    const c1y = prev.y + dy * 0.35;
    const c2y = curr.y - dy * 0.35;

    // Nearly stacked points get an alternating lateral swing so the line still snakes.
    if (dx < stackThreshold) {
      const side = swingSign;
      swingSign *= -1;
      c1x = prev.x + side * swing;
      c2x = curr.x + side * swing;
    }

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

/** Furthest length along a mostly-downward path whose y is still <= targetY. */
function lengthAtY(path: SVGPathElement, total: number, targetY: number) {
  if (total <= 0) return 0;
  if (path.getPointAtLength(total).y <= targetY) return total;
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 28; i += 1) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y <= targetY) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function ScrollPath({
  containerRef,
}: {
  containerRef?: RefObject<HTMLElement | null>;
} = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    if (isTouch) return;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    let frame = 0;
    let length = 0;

    const layout = () => {
      const root = containerRef?.current ?? document.body;
      const rootRect = root.getBoundingClientRect();
      const width = root.clientWidth || document.documentElement.clientWidth;
      const height = Math.max(root.scrollHeight, root.clientHeight, window.innerHeight);

      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-path-point]"));
      if (nodes.length === 0) {
        path.setAttribute("d", "");
        svg.style.height = "0px";
        svg.setAttribute("viewBox", `0 0 ${width} 0`);
        return 0;
      }

      const scrollY = window.scrollY;
      const centerX = width / 2;
      const minX = width * 0.08;
      const maxX = width * 0.92;
      const points: Point[] = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        const rawX = rect.left + rect.width / 2 - rootRect.left;
        return {
          x: Math.min(maxX, Math.max(minX, rawX)),
          y: rect.top + scrollY + rect.height / 2 - (rootRect.top + scrollY),
        };
      });
      points.push({
        x: centerX,
        y: Math.max(height - 24, (points.at(-1)?.y ?? 0) + 48),
      });

      const stroke = width > 800 ? 4 : 3;
      path.setAttribute("stroke-width", String(stroke));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      path.setAttribute("d", buildPath(points, width));
      length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      return length;
    };

    const paint = () => {
      if (length <= 0) {
        path.style.strokeDashoffset = "0";
        return;
      }
      // Keep the brand line fully hidden at the top of the page; reveal after scroll.
      if (window.scrollY < 12) {
        path.style.strokeDashoffset = `${length}`;
        return;
      }
      if (reduced) {
        path.style.strokeDashoffset = "0";
        return;
      }
      // Reveal by viewport Y, not page %, so horizontal weaves (same Y, lots of length)
      // still finish before those waypoints scroll off-screen.
      const root = containerRef?.current ?? document.body;
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const headY = window.scrollY + window.innerHeight * 0.55 - rootTop;
      const drawn = lengthAtY(path, length, headY);
      path.style.strokeDashoffset = `${length - drawn}`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      length = layout();
      paint();
    };

    length = layout();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(containerRef?.current ?? document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [containerRef, reduced, isTouch]);

  if (isTouch) return null;

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-path w-full"
      data-scroll-path
      aria-hidden
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="4"
        strokeOpacity="0.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
