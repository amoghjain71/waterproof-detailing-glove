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
import { formatUsd } from "@/lib/utils";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0.15);
  const [size, setSize] = useState<SizeCode>("ML");
  const [qty, setQty] = useState(1);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const card = cardRef.current;
    const progress = progressRef.current;
    if (!root || !headline || !sub || !card || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(headline, { y: 48, opacity: 0.35, scale: 1.08 });
      gsap.set(sub, { y: 28, opacity: 0 });
      gsap.set(card, { y: 64, opacity: 0 });
      if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "+=140%",
              pin: true,
              scrub: 0.65,
              onUpdate: (self) => {
                // Rain goes from light drizzle → heavy wash
                setIntensity(0.12 + self.progress * 0.88);
              },
            },
          });

          tl.to(
            headline,
            { y: 0, opacity: 1, scale: 1, ease: "none", duration: 0.35 },
            0,
          )
            .to(sub, { y: 0, opacity: 1, ease: "none", duration: 0.25 }, 0.2)
            .to(card, { y: 0, opacity: 1, ease: "none", duration: 0.35 }, 0.4);

          if (progress) {
            tl.to(progress, { scaleX: 1, ease: "none", duration: 1 }, 0);
          }
        },
        "(max-width: 767px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.5,
              onUpdate: (self) => setIntensity(0.15 + self.progress * 0.7),
            },
          });

          tl.to(headline, { y: 0, opacity: 1, scale: 1, ease: "none", duration: 0.4 }, 0)
            .to(sub, { y: 0, opacity: 1, ease: "none", duration: 0.3 }, 0.15)
            .to(card, { y: 0, opacity: 1, ease: "none", duration: 0.35 }, 0.3);
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
      className="relative overflow-hidden border-t border-rule"
    >
      <div className="absolute inset-0">
        <AutoVideo
          id="closing-cta-pair"
          className="h-full w-full opacity-40"
        />
      </div>
      <RainCanvas intensity={intensity} />

      <div className="relative z-10 mx-auto flex min-h-fold max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="mb-4 text-label text-brand">
          Close the wash dry
        </p>
        <h2
          ref={headlineRef}
          className="font-display text-h1 text-ink"
        >
          {copy.finalCta}
        </h2>
        <p ref={subRef} className="mt-4 max-w-xl text-ink-muted">
          Pre-order the {BRAND.productName}. Designed to keep water out. Built to
          stay thin under your mitt.
        </p>

        <div
          ref={cardRef}
          className="mt-10 w-full max-w-md rounded border border-rule bg-ground p-6 text-left"
        >
          <div className="flex flex-wrap gap-2">
            {SIZE_CHART.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  disabled
                  aria-disabled
                  className={cn(
                    "cursor-not-allowed border px-4 py-2 text-label border-rule text-ink-muted opacity-40",
                    size === s.code && "border-ink bg-surface text-ink opacity-50",
                  )}
                >
                  {s.label}
                </button>
            ))}
          </div>
          <p className="mt-3 text-label text-ink-muted">{selected?.note}</p>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded border border-rule px-3 py-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-6 text-center text-label">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <p className="font-display text-h3">
              {formatUsd(PRICE_USD * qty)}
            </p>
          </div>

          <button
            type="button"
            disabled
            className="mt-6 w-full bg-brand px-6 py-3 text-label font-medium text-on-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {SALES_MODE === "preorder" ? "Pre-order" : "Add to cart"} ·{" "}
            {formatUsd(PRICE_USD * qty)}
          </button>
          <p className="mt-3 text-label text-ink-muted">
            Pre-orders open from the home page signup.
          </p>
        </div>

        {!reduced ? (
          <div
            className="mt-8 h-px w-40 overflow-hidden rounded bg-border"
            aria-hidden
          >
            <div
              ref={progressRef}
              className="h-full w-full origin-left scale-x-0 bg-ink"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
