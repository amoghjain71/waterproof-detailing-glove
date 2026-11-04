"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function RainCanvas({ intensity = 0.4 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const drops: { x: number; y: number; len: number; speed: number }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      drops.length = 0;
      const count = Math.floor(40 + intensityRef.current * 120);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          len: 8 + Math.random() * 18,
          speed: 4 + Math.random() * 8,
        });
      }
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const target = Math.floor(40 + intensityRef.current * 120);
      while (drops.length < target) {
        drops.push({
          x: Math.random() * w,
          y: -20,
          len: 8 + Math.random() * 18,
          speed: 4 + Math.random() * 8,
        });
      }
      while (drops.length > target) drops.pop();

      const alpha = 0.28 + intensityRef.current * 0.45;
      ctx.strokeStyle = `rgba(127,214,255,${alpha})`;
      ctx.lineWidth = 1 + intensityRef.current * 0.6;
      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1.5 + intensityRef.current, d.y + d.len * (0.85 + intensityRef.current * 0.35));
        ctx.stroke();
        d.y += d.speed * (0.7 + intensityRef.current * 1.35);
        if (d.y > h) {
          d.y = -20;
          d.x = Math.random() * w;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2]"
      aria-hidden
    />
  );
}
