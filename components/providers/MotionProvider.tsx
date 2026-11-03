"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = document.documentElement;

    if (reducedMotion) {
      root.classList.add("reduced-motion");
      root.classList.remove("lenis", "lenis-smooth");
      setLenis(null);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.config({ limitCallbacks: true });
      return () => {
        root.classList.remove("reduced-motion");
      };
    }

    root.classList.remove("reduced-motion");

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    root.classList.add("lenis", "lenis-smooth");

    return () => {
      gsap.ticker.remove(ticker);
      setLenis(null);
      lenis.destroy();
      root.classList.remove("lenis", "lenis-smooth");
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
