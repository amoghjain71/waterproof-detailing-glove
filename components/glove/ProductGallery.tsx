"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn, FRAMER_EASE } from "@/lib/utils";
import type { GalleryItem } from "@/components/glove/GalleryLightbox";

export function ProductGallery({
  items,
  onExpand,
}: {
  items: Extract<GalleryItem, { type: "image" }>[];
  onExpand: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const current = items[index]!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  function go(delta: number) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-[#121418]"
        onTouchStart={(e) => {
          const t = e.touches[0];
          (e.currentTarget as HTMLElement).dataset.tx = String(t?.clientX ?? 0);
        }}
        onTouchEnd={(e) => {
          const start = Number((e.currentTarget as HTMLElement).dataset.tx || 0);
          const end = e.changedTouches[0]?.clientX ?? start;
          const dx = end - start;
          if (dx > 50) go(-1);
          if (dx < -50) go(1);
        }}
      >
        <button
          type="button"
          className="group relative block w-full"
          onClick={() => go(1)}
          aria-label={`Show next photo (${index + 1} of ${items.length})`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: FRAMER_EASE }}
              className="relative aspect-[4/5] w-full"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-2 sm:p-4"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          type="button"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/80 px-3 py-2 text-sm backdrop-blur hover:border-cyan/50"
          aria-label="Previous photo"
          onClick={() => go(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/80 px-3 py-2 text-sm backdrop-blur hover:border-cyan/50"
          aria-label="Next photo"
          onClick={() => go(1)}
        >
          →
        </button>

        <button
          type="button"
          className="absolute bottom-3 left-3 z-10 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan backdrop-blur hover:border-cyan/50"
          onClick={() => onExpand(index)}
        >
          Expand
        </button>

        <div className="pointer-events-none absolute bottom-3 right-3">
          <span className="rounded-full border border-border bg-background/75 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan backdrop-blur">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Product photos"
      >
        {items.map((item, i) => {
          const active = i === index;
          return (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={item.alt}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border transition-[border-color,opacity]",
                active
                  ? "border-cyan opacity-100"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted">{current.alt}</p>
    </div>
  );
}
