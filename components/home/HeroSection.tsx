"use client";

import { useEffect, useRef } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { WaterRipple } from "@/components/home/WaterRipple";
import { Button } from "@/components/ui/Button";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { SplitChars } from "@/components/ui/SplitText";
import { copy } from "@/content/copy";
import { BRAND, PRICE_USD, SALES_MODE } from "@/lib/config";
import { formatUsd } from "@/lib/utils";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;

    const chars = root.querySelectorAll(".split-char");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      chars,
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.02 },
    )
      .fromTo(
        root.querySelectorAll("[data-hero-fade]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        "-=0.35",
      );

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          gsap.to(videoWrapRef.current, {
            scale: 0.88,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(root.querySelector("[data-hero-copy]"), {
            yPercent: -12,
            // Keep copy readable; only fade slightly on scroll-away
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      });
    }, root);

    return () => {
      tl.kill();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative min-h-fold overflow-hidden"
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 origin-center will-change-transform bg-band"
      >
        <AutoVideo id="hero-droplets" className="h-full w-full" priority />
        {/* Ripple sits under the scrim so blend never washes type */}
        <WaterRipple />
        <div className="pointer-events-none absolute inset-0 z-10 bg-band/50" />
      </div>

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex min-h-fold w-full min-w-0 max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-8"
      >
        <div data-hero-fade>
          <PrototypeBadge className="mb-6 w-fit" />
        </div>
        <h1 className="font-display text-h1 max-w-5xl text-on-band">
          <span className="block">
            <SplitChars text="Wet job." />
          </span>
          <span className="block">
            <SplitChars text="Dry hands." />
          </span>
        </h1>
        <p
          data-hero-fade
          className="mt-6 max-w-xl text-lead text-on-band"
        >
          {copy.subline}
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
          <Button href="/glove">
            {copy.shopCta}
          </Button>
          <Button
            href="#problem"
            variant="band"
            onClick={() => {
              document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {copy.seeHowCta}
          </Button>
        </div>
        <p data-hero-fade className="mt-8 text-label text-on-band">
          {BRAND.productName} · {formatUsd(PRICE_USD)} / pair ·{" "}
          {SALES_MODE === "preorder" ? "Pre-order" : "Shop"}
        </p>

        <a
          href="#problem"
          data-hero-fade
          className="mt-10 inline-flex w-fit flex-col items-center gap-2 text-label text-on-band"
          aria-label="Scroll to the problem"
        >
          <span
            className="block h-4 w-4 bg-on-band"
            aria-hidden
          />
          Scroll
        </a>
      </div>
    </section>
  );
}
