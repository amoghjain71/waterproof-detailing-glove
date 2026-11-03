"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const LAYERS = [
  { label: "Outer nylon", color: "#9AA3AD", stroke: "#9AA3AD", width: 8, y: 36 },
  { label: "Neoprene foam", color: "#1F7BFF", stroke: "#1F7BFF", width: 14, y: 78 },
  { label: "Tricot", color: "#F4F6F8", stroke: "#F4F6F8", width: 6, y: 120, opacity: 0.5 },
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
    <section ref={rootRef} className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">The cuff seal</p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            Engineered cuff seal
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A 60 mm cuff with a soft silicone sealing lip on the inside, plus an
            adjustable 25 mm low-profile hook-and-loop strap. The whole closure
            is designed to sit under the wash mitt so it cannot scratch paint.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-glass p-5">
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

              <text x="40" y="158" fill="#7FD6FF" fontSize="11" letterSpacing="0.04em">
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
                stroke="#7FD6FF"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                className="transition-[d] duration-500"
              />

              <text
                x="40"
                y="228"
                fill="#F4F6F8"
                fontSize="11"
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
                stroke="#F4F6F8"
                strokeWidth="3"
                fill="none"
                opacity="0.35"
              />
            </svg>
          </div>

          <div className="mt-4 inline-flex rounded-full border border-border p-1">
            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em]",
                !closed ? "bg-accent text-white" : "text-muted",
              )}
              onClick={() => setClosed(false)}
            >
              Strap open
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em]",
                closed ? "bg-accent text-white" : "text-muted",
              )}
              onClick={() => setClosed(true)}
            >
              Strap closed
            </button>
          </div>
        </div>

        <div className="w-full self-center overflow-hidden rounded-2xl border border-border">
          <AutoVideo id="cuff-seal-macro" className="aspect-video w-full" />
        </div>
      </div>
    </section>
  );
}
