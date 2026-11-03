"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function MakingPreviewSection() {
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
          const amount = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);
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
    <section ref={rootRef} className="overflow-hidden border-t border-border">
      <div className="flex items-end justify-between gap-4 px-4 pt-16 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">How it&apos;s made</p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            Eight steps to a sealed pair
          </h2>
        </div>
        <Link
          href="/how-its-made"
          className="shrink-0 text-sm text-cyan underline-offset-4 hover:underline"
        >
          See the full build
        </Link>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex w-full flex-col gap-4 px-4 pb-20 sm:px-6 md:w-max md:flex-row lg:px-8"
      >
        {copy.makingSteps.map((step, i) => (
          <article
            key={step.title}
            className="w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-glass md:w-[280px]"
          >
            <AutoVideo id={step.video} className="aspect-video w-full" />
            <div className="p-4">
              <p className="text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-1 text-lg uppercase tracking-tight">
                {step.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
