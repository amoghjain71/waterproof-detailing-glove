"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

export function InUseSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const slides = copy.inUseSlides;

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
            end: "+=220%",
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const i = Math.min(
                slides.length - 1,
                Math.floor(self.progress * slides.length),
              );
              setIndex(i);
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, slides.length]);

  return (
    <section ref={rootRef} className="border-t border-border">
      <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">In use</p>
          <div className="mt-6 space-y-6">
            {slides.map((slide, i) => (
              <article
                key={slide.id}
                className={cn(
                  "rounded-2xl border p-5 transition-all duration-500",
                  i === index
                    ? "border-accent bg-accent/10 opacity-100"
                    : "border-border bg-glass opacity-45",
                )}
              >
                <h3 className="font-display text-xl uppercase tracking-tight">
                  {slide.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{slide.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex gap-2" aria-hidden>
            {slides.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-colors",
                  i === index ? "bg-accent" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <AutoVideo id={slide.video} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
