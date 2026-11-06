"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const LAYERS = [
  { label: "Outer nylon", color: "var(--ink-muted)", stroke: "var(--ink-muted)", width: 8, y: 36 },
  { label: "Neoprene foam", color: "var(--ink)", stroke: "var(--ink)", width: 14, y: 78 },
  { label: "Tricot", color: "var(--surface)", stroke: "var(--surface)", width: 6, y: 120, opacity: 0.5 },
] as const;

export function CuffSealSection() {
  const rootRef = useRef<HTMLElement>(null);
  const pathRefs = useRef<SVGPathElement[]>([]);
  const [closed, setClosed] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const paths = pathRefs.current.filter(Boolean);
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        end: "top 20%",
        scrub: true,
        onUpdate: (self) => {
          paths.forEach((p, i) => {
            const len = p.getTotalLength();
            gsap.set(p, {
              strokeDashoffset: len * (1 - Math.min(1, self.progress * 1.4 - i * 0.08)),
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="border-t border-rule px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-h2">Sealed cuff</h2>
          <p className="mt-4 text-body text-ink-muted">
            A soft silicone lip and a 25 mm strap close the cuff, so the water has
            nowhere to run in. Designed to. The strap sits under the mitt.
          </p>

          <div className="mt-8 overflow-hidden rounded border border-rule bg-surface p-5">
            <svg viewBox="0 0 420 280" className="h-auto w-full" aria-hidden>
              {LAYERS.map((layer, i) => {
                const pad = 40 + i * 8;
                return (
                  <g key={layer.label}>
                    <text
                      x="40"
                      y={layer.y - layer.width / 2 - 10}
                      fill={layer.color}
                      fontSize="11"
                      letterSpacing="0.04em"
                    >
                      {layer.label}
                    </text>
                    <path
                      ref={(el) => {
                        if (el) pathRefs.current[i] = el;
                      }}
                      d={`M${pad} ${layer.y} H${420 - pad}`}
                      stroke={layer.stroke}
                      strokeWidth={layer.width}
                      fill="none"
                      strokeLinecap="round"
                      opacity={"opacity" in layer ? layer.opacity : 1}
                    />
                  </g>
                );
              })}

              <text x="40" y="158" fill="var(--ink-muted)" fontSize="14" letterSpacing="0.04em">
                Silicone lip
              </text>
              <path
                ref={(el) => {
                  if (el) pathRefs.current[3] = el;
                }}
                d={
                  closed
                    ? "M90 178 C140 205, 280 205, 330 178"
                    : "M90 192 C140 180, 280 180, 330 192"
                }
                stroke="var(--ink)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                className="transition-colors duration-500"
              />

              <text
                x="40"
                y="228"
                fill="var(--ink-muted)"
                fontSize="14"
                opacity="0.6"
                letterSpacing="0.04em"
              >
                Strap line
              </text>
              <path
                ref={(el) => {
                  if (el) pathRefs.current[4] = el;
                }}
                d="M70 246 H350"
                stroke="var(--rule)"
                strokeWidth="3"
                fill="none"
                opacity="0.35"
              />
            </svg>
          </div>

          <div className="mt-4 inline-flex rounded border border-rule p-1">
            <button
              type="button"
              className={cn(
                "h-12 px-4 text-label",
                !closed ? "border border-ink bg-surface text-ink" : "text-ink-muted",
              )}
              onClick={() => setClosed(false)}
            >
              Strap open
            </button>
            <button
              type="button"
              className={cn(
                "h-12 px-4 text-label",
                closed ? "border border-ink bg-surface text-ink" : "text-ink-muted",
              )}
              onClick={() => setClosed(true)}
            >
              Strap closed
            </button>
          </div>
        </div>

        <div className="w-full self-center overflow-hidden border border-rule">
          <AutoVideo id="cuff-seal-macro" className="aspect-video w-full" />
        </div>
      </div>
    </section>
  );
}
