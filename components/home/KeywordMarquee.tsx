"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function KeywordMarquee() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const items = [...copy.keywordMarquee, ...copy.keywordMarquee, ...copy.keywordMarquee];

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reduced) return;

    const tween = gsap.to(track, {
      xPercent: -33.333,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = 1 + Math.abs(self.getVelocity()) / 2000;
          tween.timeScale(Math.min(v, 3.5));
        },
      });
    }, root);

    return () => {
      tween.kill();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="overflow-hidden border-y border-border bg-glass py-8"
      aria-label="Product keywords"
    >
      <div
        ref={trackRef}
        className="flex w-max gap-10 whitespace-nowrap will-change-transform px-4"
      >
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="font-display text-2xl uppercase tracking-tight text-foreground/90 sm:text-4xl"
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
