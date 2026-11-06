"use client";

import { useCallback, useEffect, useState } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToY } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

function getStorySections(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("#main section"),
  );
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-h",
  );
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 68;
}

/**
 * Skip past the current scroll-pinned animation (or jump to the next
 * home section) so heavy scrub sequences are optional.
 */
export function SkipSectionButton() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const [label, setLabel] = useState("Skip section");

  const refreshLabel = useCallback(() => {
    registerGsap();
    const sections = getStorySections();
    if (sections.length < 2) {
      setVisible(false);
      return;
    }

    const activePin = ScrollTrigger.getAll().find(
      (t) => t.isActive && Boolean(t.vars.pin),
    );
    if (activePin) {
      setVisible(true);
      setLabel("Skip animation");
      return;
    }

    const mid = window.innerHeight * 0.4;
    let idx = 0;
    sections.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) idx = i;
    });

    if (idx >= sections.length - 1) {
      setVisible(false);
      return;
    }

    setVisible(true);
    setLabel("Next section");
  }, []);

  useEffect(() => {
    const kick = window.setTimeout(refreshLabel, 0);
    window.addEventListener("scroll", refreshLabel, { passive: true });
    window.addEventListener("resize", refreshLabel);
    const id = window.setInterval(refreshLabel, 600);
    return () => {
      window.clearTimeout(kick);
      window.removeEventListener("scroll", refreshLabel);
      window.removeEventListener("resize", refreshLabel);
      window.clearInterval(id);
    };
  }, [refreshLabel]);

  const onSkip = () => {
    registerGsap();
    const immediate = reduced;
    const offset = headerOffset() + 8;

    const activePin = ScrollTrigger.getAll().find(
      (t) => t.isActive && Boolean(t.vars.pin),
    );
    if (activePin) {
      // Jump just past the pin scrub so the animation is skipped entirely
      scrollToY(activePin.end + 4, immediate);
      window.setTimeout(refreshLabel, immediate ? 50 : 400);
      return;
    }

    const sections = getStorySections();
    const mid = window.innerHeight * 0.4;
    let idx = 0;
    sections.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) idx = i;
    });

    const next = sections[idx + 1];
    if (!next) {
      setVisible(false);
      return;
    }

    const top = next.getBoundingClientRect().top + window.scrollY - offset;
    scrollToY(Math.max(0, top), immediate);
    window.setTimeout(refreshLabel, immediate ? 50 : 400);
  };

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-50 sm:bottom-8 sm:right-6">
      <button
        type="button"
        onClick={onSkip}
        className={cn(
          "pointer-events-auto inline-flex items-center gap-2 rounded border border-rule",
          "bg-band/92 px-4 py-2 text-label font-medium",
          "bg-band px-4 py-2 text-label font-medium text-on-band",
          "hover:border-brand hover:text-brand focus-visible:outline-none",
        )}
        aria-label={`${label}. Skip the current scroll animation and jump ahead.`}
      >
        <span aria-hidden className="text-brand">
          ↓
        </span>
        {label}
      </button>
    </div>
  );
}
