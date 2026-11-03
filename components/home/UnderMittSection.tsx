"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function UnderMittSection() {
  const rootRef = useRef<HTMLElement>(null);
  const mittRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.fromTo(
            mittRef.current,
            { xPercent: -70, opacity: 0.4 },
            {
              xPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            },
          );
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan">Under the mitt</p>
        <h2 className="font-display mt-3 max-w-3xl text-3xl uppercase tracking-tight sm:text-5xl">
          {copy.underTheMitt}
        </h2>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-glass p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/glove-in-use.png"
                alt="Waterproof inner glove on hand during a wash"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                ref={mittRef}
                className="absolute inset-y-6 left-0 flex w-[70%] items-center will-change-transform"
              >
                <div className="h-[70%] w-full rounded-[40%] bg-[radial-gradient(circle_at_30%_40%,#3b82f6,#1d4ed8_45%,#0f172a)] opacity-90 shadow-2xl" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Scroll scrubs a blue microfiber mitt sliding over the glove — then
              see the swap loop.
            </p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-glass p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <AutoVideo id="mitt-swap" className="absolute inset-0 h-full w-full" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Put the glove on once at the start of a wash. Swap mitts in seconds
              while the engineered cuff seal stays under the mitt — designed to
              keep bucket water off your hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
