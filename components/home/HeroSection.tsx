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
        "(min-width: 768px)": () => {
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
      className="relative min-h-[calc(100svh-var(--header-h))] overflow-hidden"
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 origin-center will-change-transform bg-[#07080a]"
      >
        <AutoVideo id="hero-droplets" className="h-full w-full" priority />
        {/* Ripple sits under the scrim so blend never washes type */}
        <WaterRipple />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/65 via-black/75 to-[#07080a]" />
        <div className="absolute inset-0 z-[2] bg-black/35" />
      </div>

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--header-h))] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-8"
      >
        <div data-hero-fade>
          <PrototypeBadge className="mb-6 w-fit" />
        </div>
        <h1 className="font-display hero-headline max-w-5xl overflow-hidden text-white">
          <span className="block">
            <SplitChars text="Wet job." />
          </span>
          <span className="block">
            <SplitChars text="Dry hands." />
          </span>
        </h1>
        <p
          data-hero-fade
          className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl"
        >
          {copy.subline}
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
          <Button href="/glove" magnetic>
            {copy.shopCta}
          </Button>
          <Button
            href="#problem"
            variant="outline"
            className="border-white/40 bg-black/35 text-white backdrop-blur-sm hover:border-cyan/60 hover:bg-black/50"
            onClick={() => {
              document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {copy.seeHowCta}
          </Button>
        </div>
        <p data-hero-fade className="mt-8 text-sm text-white/65">
          {BRAND.productName} · {formatUsd(PRICE_USD)} / pair ·{" "}
          {SALES_MODE === "preorder" ? "Pre-order" : "Shop"}
        </p>

        <a
          href="#problem"
          data-hero-fade
          className="mt-10 inline-flex w-fit flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cyan"
          aria-label="Scroll to the problem"
        >
          <span
            className="block h-5 w-3.5 animate-bounce rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-cyan/80"
            aria-hidden
          />
          Scroll
        </a>
      </div>
    </section>
  );
}
