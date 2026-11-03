"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { BRAND } from "@/lib/config";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const drops = Array.from({ length: 36 }, () => ({
      x: size / 2,
      y: size / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      r: 2 + Math.random() * 4,
      life: 1,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      for (const d of drops) {
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.12;
        d.life -= 0.012;
        if (d.life <= 0) continue;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 0.7, d.r, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127,214,255,${Math.max(d.life, 0)})`;
        ctx.fill();
      }
      if (drops.some((d) => d.life > 0)) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div>
      <PageHero
        title="You're on the list"
        description={`Thanks for supporting ${BRAND.name}. Your mock order is confirmed.`}
      />
      <section className="mx-auto max-w-xl px-4 py-14 text-center lg:px-8">
        <div className="relative mx-auto mb-6 flex h-[280px] w-[280px] items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-accent/40 bg-accent/15">
            <span className="text-3xl text-cyan" aria-hidden>
              ✓
            </span>
          </div>
        </div>
        <p className="font-display text-lg uppercase tracking-tight">
          Order {orderId}
        </p>
        <p className="mt-3 text-sm text-muted">
          Watch your inbox for fit-trial and production timing updates. No card
          was charged — this was a mock checkout.
        </p>
        <Button href="/glove" className="mt-8">
          Back to the glove
        </Button>
      </section>
    </div>
  );
}
