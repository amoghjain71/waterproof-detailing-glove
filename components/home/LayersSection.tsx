"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
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
        "(min-width: 1024px)": () => {
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
    <section ref={rootRef} className="relative overflow-hidden border-t border-rule">
      <div className="absolute inset-0 opacity-30">
        <AutoVideo id="layers-macro" className="h-full w-full" />
      </div>

      <div className="mx-auto grid min-h-fold max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 data-path-point className="relative z-10 font-display text-h2">
            Thin
          </h2>
          <p className="relative z-10 mt-4 text-body text-ink">
            One millimeter of neoprene between a matte nylon shell and a smooth tricot
            lining. The target finished laminate is 1.8 mm or thinner, so your mitt still
            slides on.
          </p>
        </div>

        <div
          ref={stackRef}
          className="relative mx-auto flex w-full max-w-md flex-col gap-3 md:min-h-fold md:gap-0"
        >
          {MATERIAL_IMAGES.map((material, i) => (
            <div
              key={material.id}
              data-layer
              className="relative w-full overflow-hidden border border-rule md:w-full"
              style={{ zIndex: MATERIAL_IMAGES.length - i }}
            >
              <div className="relative aspect-layer w-full">
                <Image
                  src={material.src}
                  alt={material.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0" />
                {i === 0 && (
                  <>
                    <span
                      data-bead
                      className="absolute top-3 h-2 w-2 rounded bg-ink"
                    />
                    <span
                      data-bead
                      className="absolute top-5 h-1.5 w-1.5 rounded bg-ink"
                    />
                    <span
                      data-bead
                      className="absolute top-2 h-2.5 w-2.5 rounded bg-surface"
                    />
                  </>
                )}
                <p className="absolute inset-x-0 bottom-2 text-center text-label text-on-brand">
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
