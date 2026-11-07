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
        "(min-width: 1024px)": () => {
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
    <section ref={rootRef} className="relative w-full min-w-0 overflow-hidden border-t border-rule">
      <div className="px-4 pt-16 sm:px-6 lg:px-8">
        <p className="text-label text-brand">The pivot</p>
        <h2 className="font-display mt-3 max-w-3xl text-h2 sm:text-h1">
          From lined mitt to under-mitt glove
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex w-full min-w-0 flex-col gap-6 px-4 pb-20 sm:px-6 md:w-max md:flex-row lg:px-8"
      >
        {copy.pivotCards.map((card, i) => (
          <article
            key={card.title}
            className="w-full shrink-0 rounded border border-rule bg-surface p-8 md:max-w-md"
          >
            <p className="font-display text-label text-brand">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-4 text-h3">
              {card.title}
            </h3>
            <p className="mt-4 text-label leading-relaxed text-ink-muted">{card.body}</p>
            {"attribution" in card && card.attribution ? (
              <p className="mt-6 text-label text-brand">
                {card.attribution} · not a customer review
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
