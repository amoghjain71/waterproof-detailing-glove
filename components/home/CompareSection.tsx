"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/content/copy";
import { BRAND } from "@/lib/config";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function CompareSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-compare-row]"), {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan">Compare</p>
        <h2 className="font-display mt-3 max-w-3xl text-3xl uppercase tracking-tight sm:text-5xl">
          Why an under-mitt glove
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted">{copy.compareIntro}</p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-glass text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-4">Feature</th>
                <th className="px-4 py-4">Microfiber / merino mitt alone</th>
                <th className="px-4 py-4">Nitrile gloves</th>
                <th className="px-4 py-4">Thick neoprene</th>
                <th className="px-4 py-4 text-accent shadow-[inset_0_0_40px_rgba(31,123,255,0.25)]">
                  {BRAND.name} glove
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.compareRows.map((row) => (
                <tr
                  key={row.feature}
                  data-compare-row
                  className="border-t border-border/80"
                >
                  <td className="px-4 py-4 font-medium">{row.feature}</td>
                  <td className="px-4 py-4 text-muted">{row.mitt}</td>
                  <td className="px-4 py-4 text-muted">{row.nitrile}</td>
                  <td className="px-4 py-4 text-muted">{row.thickNeo}</td>
                  <td className="bg-accent/10 px-4 py-4 text-cyan">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
