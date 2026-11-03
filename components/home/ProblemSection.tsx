"use client";

import { useEffect, useRef } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { DropletDivider } from "@/components/home/DropletDivider";
import { copy } from "@/content/copy";
import { SURVEY_FOOTNOTE } from "@/lib/config";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function ProblemSection() {
  const rootRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "+=160%",
              pin: true,
              scrub: 1,
            },
          });

          tl.fromTo(
            root,
            { backgroundColor: "#0A0B0D" },
            { backgroundColor: "#101820", duration: 0.4 },
            0,
          )
            .fromTo(
              maskRef.current,
              { clipPath: "circle(18% at 70% 50%)" },
              { clipPath: "circle(140% at 70% 50%)", ease: "none", duration: 1 },
              0,
            );

          root.querySelectorAll<HTMLElement>("[data-stat]").forEach((el, i) => {
            const end = Number(el.dataset.end || 0);
            const obj = { v: 0 };
            tl.to(
              obj,
              {
                v: end,
                duration: 0.5,
                ease: "none",
                onUpdate: () => {
                  const label = el.dataset.format;
                  if (label === "pct") el.textContent = `${Math.round(obj.v)}%`;
                  else if (label === "ratio") el.textContent = "9 in 10";
                  else el.textContent = `${Math.round(obj.v)}%`;
                },
              },
              0.25 + i * 0.15,
            );
            gsap.fromTo(
              el.parentElement,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: "+=160%",
                  scrub: true,
                },
                delay: i * 0.05,
              },
            );
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(root.querySelectorAll("[data-stat-card]"), {
            opacity: 0,
            y: 24,
            stagger: 0.1,
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} id="problem" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">The problem</p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            Cold, wet hands are the wash default
          </h2>
          <DropletDivider className="justify-start py-4" />
          <ul className="mt-4 space-y-4">
            <li data-stat-card className="rounded-2xl border border-border bg-glass px-5 py-4">
              <p
                data-stat
                data-end="90"
                data-format="ratio"
                className="font-display text-3xl text-accent"
              >
                9 in 10
              </p>
              <p className="mt-1 text-sm text-muted">
                {copy.problemStats[0].label}
              </p>
            </li>
            <li data-stat-card className="rounded-2xl border border-border bg-glass px-5 py-4">
              <p
                data-stat
                data-end="82"
                data-format="pct"
                className="font-display text-3xl text-accent"
              >
                82%
              </p>
              <p className="mt-1 text-sm text-muted">
                {copy.problemStats[1].label}
              </p>
            </li>
            <li data-stat-card className="rounded-2xl border border-border bg-glass px-5 py-4">
              <p
                data-stat
                data-end="64"
                data-format="pct"
                className="font-display text-3xl text-accent"
              >
                64%
              </p>
              <p className="mt-1 text-sm text-muted">
                {copy.problemStats[2].label}
              </p>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted">{SURVEY_FOOTNOTE}</p>
        </div>

        <div
          ref={maskRef}
          className="relative aspect-square overflow-hidden rounded-full border border-border md:aspect-auto md:h-[70vh] md:rounded-none md:[clip-path:circle(18%_at_70%_50%)]"
        >
          <AutoVideo id="problem-cold-hands" className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
