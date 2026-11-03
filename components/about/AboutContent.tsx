"use client";

import { useEffect, useRef } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { surveyQuotes, surveyMeta } from "@/content/survey";
import { BRAND } from "@/lib/config";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const RULES = [
  "Stay thin enough to live under a standard wash mitt.",
  "Keep the cuff sealed and the closure under the mitt — paint-safe.",
  "Support mitt swaps, not a single mitt for the whole wash.",
] as const;

const VALUES = [
  {
    title: "Benevolence",
    body: "Health and comfort of the person washing come before a clever SKU story.",
  },
  {
    title: "Loyalty",
    body: "Show the same product truth to detailers that we would want ourselves.",
  },
  {
    title: "Achievement",
    body: "Earn claims with published gates — pass or fail — not marketing adjectives.",
  },
] as const;

export function AboutContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-reveal]"), {
        opacity: 0,
        y: 22,
        stagger: 0.08,
        duration: 0.6,
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
    <div ref={rootRef}>
      <PageHero
        eyebrow={BRAND.name}
        title="Built from how detailers actually wash"
        description="A student entrepreneur who started detailing, surveyed the people doing the work, and pivoted from a lined mitt to a glove worn once under any mitt."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <h2 data-reveal className="font-display text-2xl uppercase tracking-tight">
          The founder story
        </h2>
        <div data-reveal className="mt-6 space-y-4 text-base leading-relaxed text-muted">
          <p>
            The first design was a lined wash mitt. Then came a founder-run
            survey of 62 detailers and enthusiasts across WA, OR, CA, TX, FL, MI,
            KS, and IN.
          </p>
          <p>
            Pros swap between 2 and 4 mitts per wash — each mitt often in hand
            only 15 to 30 seconds. They want the inside to stay dry when a mitt
            goes back in the bucket. They do not want a strap that could scratch
            paint.
          </p>
          <p>
            So the product became an inner glove: put it on once, swap mitts in
            seconds, leave mitts soaking without flooding your hands.
          </p>
        </div>

        <h3
          data-reveal
          className="font-display mt-12 text-xl uppercase tracking-tight"
        >
          Three survey-driven design rules
        </h3>
        <ol className="mt-5 space-y-3 text-sm text-muted">
          {RULES.map((rule, i) => (
            <li
              key={rule}
              data-reveal
              className="rounded-xl border border-border px-4 py-3"
            >
              {i + 1}. {rule}
            </li>
          ))}
        </ol>

        <h3
          data-reveal
          className="font-display mt-12 text-xl uppercase tracking-tight"
        >
          Values
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {VALUES.map((v) => (
            <article
              key={v.title}
              data-reveal
              className="rounded-2xl border border-border bg-glass p-4"
            >
              <h4 className="font-display text-sm uppercase tracking-tight text-accent">
                {v.title}
              </h4>
              <p className="mt-2 text-sm text-muted">{v.body}</p>
            </article>
          ))}
        </div>

        <div
          data-reveal
          className="mt-12 rounded-2xl border border-accent/30 bg-accent/10 p-6"
        >
          <h3 className="font-display text-xl uppercase tracking-tight">
            The commitment
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Health and safety before profit. Honest demos. Clear material
            labeling. We show every test result, passed or not — and we do not
            claim certification, chemical resistance, or thermal ratings until
            the gates earn them.
          </p>
        </div>

        <h3
          data-reveal
          className="font-display mt-12 text-xl uppercase tracking-tight"
        >
          From our survey
        </h3>
        <ul className="mt-5 space-y-3">
          {surveyQuotes.map((q) => (
            <li
              key={q.id}
              data-reveal
              className="rounded-xl border border-border bg-glass px-4 py-3 text-sm text-foreground/90"
            >
              “{q.text}”
              <span className="mt-2 block text-xs text-muted">
                From our survey · not a customer review
              </span>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-4 text-xs text-muted">
          {surveyMeta.footnote}
        </p>
      </section>
    </div>
  );
}
