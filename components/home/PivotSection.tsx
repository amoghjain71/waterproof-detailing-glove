"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function PivotSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const amount = () => track.scrollWidth - window.innerWidth + 64;
          gsap.to(track, {
            x: () => -amount(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${amount()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative overflow-hidden border-t border-border">
      <div className="px-4 pt-16 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan">The pivot</p>
        <h2 className="font-display mt-3 max-w-3xl text-3xl uppercase tracking-tight sm:text-5xl">
          From lined mitt to under-mitt glove
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex w-max gap-6 px-4 pb-20 sm:px-6 lg:px-8 md:flex-row flex-col md:w-max w-full"
      >
        {copy.pivotCards.map((card, i) => (
          <article
            key={card.title}
            className="w-full shrink-0 rounded-2xl border border-border bg-glass p-8 md:w-[min(80vw,420px)]"
          >
            <p className="font-display text-sm text-accent">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-4 text-2xl uppercase tracking-tight">
              {card.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{card.body}</p>
            {"attribution" in card && card.attribution ? (
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-cyan">
                {card.attribution} · not a customer review
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
