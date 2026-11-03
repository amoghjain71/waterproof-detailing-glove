"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              videoRef.current?.setProgress(self.progress);
              const idx = copy.meetAnnotations.findIndex(
                (a, i, arr) =>
                  self.progress >= a.at &&
                  (i === arr.length - 1 || self.progress < arr[i + 1]!.at),
              );
              setActive(idx < 0 ? 0 : idx);
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-border bg-background"
    >
      <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">Meet the glove</p>
          <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
            Thin enough to live under any mitt
          </h2>
          <ul className="mt-8 space-y-3">
            {copy.meetAnnotations.map((a, i) => (
              <li
                key={a.label}
                className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                  active === i
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted"
                }`}
              >
                {a.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border">
          {/* product-turntable still missing — AutoVideo shows placeholder; concept image as visual anchor */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/glove-concept.png"
              alt=""
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <AutoVideo
            ref={videoRef}
            id="product-turntable"
            scrub
            className="relative z-10 aspect-square w-full md:aspect-video"
          />
        </div>
      </div>
    </section>
  );
}
