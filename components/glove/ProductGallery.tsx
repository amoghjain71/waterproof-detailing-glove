"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn, FRAMER_EASE } from "@/lib/utils";
import { AutoVideo } from "@/components/media/AutoVideo";
import type { GalleryItem } from "@/components/glove/GalleryLightbox";

export function ProductGallery({
  items,
  onExpand,
}: {
  items: GalleryItem[];
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
        className="relative overflow-hidden border border-rule bg-surface"
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
              key={current.type === "image" ? current.src : current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: FRAMER_EASE }}
              className="relative aspect-portrait w-full"
            >
              {current.type === "image" ? (
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-4"
                  priority={index === 0}
                />
              ) : (
                <AutoVideo id={current.id} className="h-full w-full" priority={index === 0} />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          type="button"
          className="absolute left-3 top-1/2 z-10 h-12 -translate-y-1/2 border border-rule bg-ground px-3 text-label hover:border-ink"
          aria-label="Previous photo"
          onClick={() => go(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 h-12 -translate-y-1/2 border border-rule bg-ground px-3 text-label hover:border-ink"
          aria-label="Next photo"
          onClick={() => go(1)}
        >
          →
        </button>

        <button
          type="button"
          className="absolute bottom-3 left-3 z-10 h-12 border border-rule bg-ground px-3 text-label text-ink hover:border-ink"
          onClick={() => onExpand(index)}
        >
          Expand
        </button>

        <div className="pointer-events-none absolute bottom-3 right-3">
          <span className="border border-rule bg-ground px-3 py-1 text-label text-ink">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 scroll-hide"
        role="tablist"
        aria-label="Product photos"
      >
        {items.map((item, i) => {
          const active = i === index;
          const label = item.type === "image" ? item.alt : item.label;
          const key = item.type === "image" ? item.src : item.id;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={label}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden border text-label",
                active ? "border-ink" : "border-rule",
              )}
            >
              {item.type === "image" ? (
                <Image src={item.src} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-ink">Video</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-label text-ink-muted">
        {current.type === "image" ? current.alt : current.label}
      </p>
    </div>
  );
}
