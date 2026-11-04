"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const MATERIAL_IMAGES = [
  {
    id: "nylon",
    src: "/images/materials/nylon.jpg",
    label: "Nylon",
    alt: "Matte-black stretch nylon with a water-repellent surface",
  },
  {
    id: "neoprene",
    src: "/images/materials/neoprene.jpg",
    label: "1.0 mm neoprene",
    alt: "Closed-cell neoprene foam, target 1.0 mm",
  },
  {
    id: "tricot",
    src: "/images/materials/tricot.jpg",
    label: "Tricot",
    alt: "Smooth, low-friction polyester tricot",
  },
] as const;

export function LayersSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
          const gap = 118;

          // Collapsed vertical pile → explode downward into a clear stack
          gsap.set(layers, {
            position: "absolute",
            left: "50%",
            xPercent: -50,
            top: 24,
            width: "86%",
            y: (i: number) => i * 10,
          });
          gsap.set(stack, { height: 420 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "+=180%",
              pin: true,
              scrub: 1,
            },
          });

          layers.forEach((layer, i) => {
            tl.to(
              layer,
              {
                y: i * gap,
                ease: "none",
                duration: 1,
              },
              0,
            );
          });

          tl.fromTo(
            root.querySelectorAll("[data-bead]"),
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4 },
            0.45,
          );
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-30">
        <AutoVideo id="layers-macro" className="h-full w-full scale-110 blur-sm" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">Three layers</p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            <span className="block">What’s between you</span>
            <span className="block">and the water</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {copy.layers.map((layer) => (
              <li key={layer.id} className="rounded-xl border border-border bg-background/70 p-4">
                <p className="font-display text-lg uppercase tracking-tight text-accent">
                  {layer.title}
                </p>
                <p className="mt-2 text-sm text-muted">{layer.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={stackRef}
          className="relative mx-auto flex w-full max-w-md flex-col gap-3 md:h-[460px] md:gap-0"
        >
          {MATERIAL_IMAGES.map((material, i) => (
            <div
              key={material.id}
              data-layer
              className="relative w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl md:w-[86%]"
              style={{ zIndex: MATERIAL_IMAGES.length - i }}
            >
              <div className="relative aspect-[16/7] w-full">
                <Image
                  src={material.src}
                  alt={material.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                {i === 0 && (
                  <>
                    <span
                      data-bead
                      className="absolute left-[18%] top-3 h-2 w-2 rounded-full bg-cyan/80"
                    />
                    <span
                      data-bead
                      className="absolute left-[42%] top-5 h-1.5 w-1.5 rounded-full bg-cyan/70"
                    />
                    <span
                      data-bead
                      className="absolute left-[66%] top-2 h-2.5 w-2.5 rounded-full bg-accent/80"
                    />
                  </>
                )}
                <p className="absolute inset-x-0 bottom-2 text-center text-[10px] uppercase tracking-[0.16em] text-white">
                  {material.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
