"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { TEST_GATES } from "@/data/tests";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const STATUS_LABEL = {
  planned: "Planned",
  in_testing: "In testing",
  passed: "Passed",
  failed: "Failed",
} as const;

export function ProvenSection() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "bottom 40%",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">
            Built to be proven
          </p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            {copy.testedHeading}
          </h2>

          <div className="relative mt-10 space-y-6 pl-8">
            {/* left-4 = center of the pl-8 gutter; translate centers the 1px line */}
            <div
              ref={lineRef}
              className="absolute bottom-2 left-4 top-2 origin-top w-px -translate-x-1/2 bg-accent"
              aria-hidden
            />
            {TEST_GATES.map((gate) => (
              <article key={gate.id} className="relative">
                <span className="absolute -left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg uppercase tracking-tight">
                    {gate.code} · {gate.name}
                  </h3>
                  <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-wider text-muted">
                    {STATUS_LABEL[gate.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{gate.passMeans}</p>
              </article>
            ))}
          </div>

          <Link
            href="/tested"
            className="mt-8 inline-flex text-sm text-cyan underline-offset-4 hover:underline"
          >
            Open the full testing program
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border lg:sticky lg:top-28 lg:h-fit">
          <AutoVideo id="durability-montage" className="aspect-video w-full" />
        </div>
      </div>
    </section>
  );
}
