"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { RainCanvas } from "@/components/home/RainCanvas";
import { copy } from "@/content/copy";
import { SIZE_CHART, type SizeCode } from "@/data/sizes";
import {
  BRAND,
  PRICE_USD,
  SALES_MODE,
} from "@/lib/config";
import { useCart } from "@/lib/store/cart";
import { formatUsd } from "@/lib/utils";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [intensity, setIntensity] = useState(0.35);
  const [size, setSize] = useState<SizeCode>("M");
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: true,
            onUpdate: (self) => setIntensity(0.35 + self.progress * 0.65),
          });
        },
        "(max-width: 767px)": () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
            onUpdate: (self) => setIntensity(0.35 + self.progress * 0.5),
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const selected = SIZE_CHART.find((s) => s.code === size);

  return (
    <section
      ref={rootRef}
      id="final-cta"
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0">
        <AutoVideo
          id="closing-cta-pair"
          forceMissing
          className="h-full w-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      </div>
      <RainCanvas intensity={intensity} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--header-h))] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h2 className="font-display hero-headline text-foreground">
          {copy.finalCta}
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Pre-order the {BRAND.productName}. Designed to keep water out. Built to
          stay thin under your mitt.
        </p>

        <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-background/70 p-6 text-left backdrop-blur-md">
          <div className="flex flex-wrap gap-2">
            {SIZE_CHART.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => setSize(s.code)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm",
                  size === s.code
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border text-muted",
                )}
              >
                {s.code}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{selected?.note}</p>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-full border border-border px-3 py-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <p className="font-display text-2xl">
              {formatUsd(PRICE_USD * qty)}
            </p>
          </div>

          <button
            type="button"
            className="btn-ripple mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
            onClick={() =>
              addItem({ size, qty, price: PRICE_USD, sku: BRAND.sku })
            }
          >
            {SALES_MODE === "preorder" ? "Pre-order" : "Add to cart"} ·{" "}
            {formatUsd(PRICE_USD * qty)}
          </button>
          <p className="mt-3 text-[11px] text-muted">
            Opens your cart drawer with size {size}.
          </p>
        </div>
      </div>
    </section>
  );
}
