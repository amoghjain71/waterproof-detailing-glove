"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo, type AutoVideoHandle } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function MeetGloveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<AutoVideoHandle>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const syncFromProgress = (progress: number) => {
      videoRef.current?.setProgress(progress);
      const idx = copy.meetAnnotations.findIndex(
        (a, i, arr) =>
          progress >= a.at &&
          (i === arr.length - 1 || progress < arr[i + 1]!.at),
      );
      setActive(idx < 0 ? 0 : idx);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          // Longer travel = slower spin per scroll tick (still 1:1 with progress).
          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: true,
            onUpdate: (self) => syncFromProgress(self.progress),
          });
        },
        "(max-width: 767px)": () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top 85%",
            end: "+=220%",
            scrub: true,
            onUpdate: (self) => syncFromProgress(self.progress),
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-rule bg-ground"
    >
      <div className="mx-auto grid min-h-fold max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-h2">Turn the glove</h2>
          <p className="mt-4 text-body text-ink-muted">
            Scroll to walk around the sample. The callouts mark the parts that matter in a wash.
          </p>
          <ul className="mt-8 space-y-3">
            {copy.meetAnnotations.map((a, i) => (
              <li
                key={a.label}
                className={`border px-4 py-3 text-label ${
                  active === i ? "border-ink bg-surface text-ink" : "border-rule text-ink-muted"
                }`}
              >
                {a.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden border border-rule">
          <AutoVideo
            ref={videoRef}
            id="product-turntable"
            scrub
            className="aspect-square w-full md:aspect-video"
          />
        </div>
      </div>
    </section>
  );
}
