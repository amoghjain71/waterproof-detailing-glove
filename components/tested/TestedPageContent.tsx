"use client";

import { useEffect, useRef } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { PageHero } from "@/components/ui/PageHero";
import { copy } from "@/content/copy";
import { NOT_CLAIMING_YET, TEST_GATES } from "@/data/tests";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const STATUS_LABEL = {
  planned: "Planned",
  in_testing: "In testing",
  passed: "Passed",
  failed: "Failed",
} as const;

export function TestedPageContent() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const grid = gridRef.current;
    if (!grid || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(grid.querySelectorAll("[data-test-card]"), {
        opacity: 0,
        y: 24,
        stagger: 0.06,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, grid);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div>
      <PageHero
        showBadge
        eyebrow="Reliability"
        title={copy.testedHeading}
        description="Prototype V2 validation gates cover leakage, cuff wear, flex life, closure cycles, care, chemistry, and mitt compatibility. Statuses update as results land."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border">
          <AutoVideo id="durability-montage" className="aspect-video w-full" />
        </div>
        <div className="rounded-2xl border border-border bg-glass p-6">
          <h2 className="font-display text-xl uppercase tracking-tight">
            Testing transparency promise
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We publish method, sample count, pass criteria, and outcome for every
            gate — including failures. No certification theater. No silent skips.
            Chemical and thermal language stays off until those gates earn it.
          </p>
          <h3 className="mt-8 text-sm font-medium">
            What we&apos;re not claiming yet
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {NOT_CLAIMING_YET.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 lg:px-8">
        <div
          ref={gridRef}
          className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2"
        >
          {TEST_GATES.map((gate) => (
            <article
              key={gate.id}
              data-test-card
              className="rounded-2xl border border-border bg-glass p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan">
                    {gate.code}
                    {gate.optional ? " · optional" : ""}
                  </p>
                  <h3 className="font-display mt-2 text-xl uppercase tracking-tight">
                    {gate.name}
                  </h3>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-wider text-muted">
                  {STATUS_LABEL[gate.status]}
                </span>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Method</dt>
                  <dd className="mt-1">{gate.method}</dd>
                </div>
                <div>
                  <dt className="text-muted">Sample</dt>
                  <dd className="mt-1">{gate.sampleCount}</dd>
                </div>
                <div>
                  <dt className="text-muted">Pass means</dt>
                  <dd className="mt-1">{gate.passMeans}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-7xl rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-lg uppercase tracking-tight">
            Results gallery
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Charts, photos, and pass/fail artifacts will appear here as gates
            complete. Empty on purpose until real data lands.
          </p>
        </div>
      </section>
    </div>
  );
}
