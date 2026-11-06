"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AutoVideo } from "@/components/media/AutoVideo";
import { FRAMER_EASE } from "@/lib/utils";
import type { VideoId } from "@/content/videos";

export type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; id: VideoId; label: string; forceMissing?: boolean };

function LightboxInner({
  items,
  initialIndex,
  onClose,
}: {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const item = items[index]!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-drawer flex items-center justify-center bg-ground p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: FRAMER_EASE }}
      role="dialog"
      aria-modal
      aria-label="Product gallery"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded border border-rule bg-surface px-3 py-2 text-label"
        onClick={onClose}
      >
        Close
      </button>

      <button
        type="button"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded border border-rule bg-surface px-3 py-2"
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i - 1 + items.length) % items.length);
        }}
      >
        ←
      </button>
      <button
        type="button"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded border border-rule bg-surface px-3 py-2"
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i + 1) % items.length);
        }}
      >
        →
      </button>

      <motion.div
        key={index}
        className="relative w-full max-w-4xl overflow-hidden rounded border border-rule"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: FRAMER_EASE }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          const t = e.touches[0];
          (e.currentTarget as HTMLElement).dataset.tx = String(t?.clientX ?? 0);
        }}
        onTouchEnd={(e) => {
          const start = Number((e.currentTarget as HTMLElement).dataset.tx || 0);
          const end = e.changedTouches[0]?.clientX ?? start;
          const dx = end - start;
          if (dx > 50) setIndex((i) => (i - 1 + items.length) % items.length);
          if (dx < -50) setIndex((i) => (i + 1) % items.length);
        }}
      >
        {item.type === "image" ? (
          <Image
            src={item.src}
            alt={item.alt}
            width={1600}
            height={1200}
            className="h-auto max-h-sheet w-full object-contain"
          />
        ) : (
          <AutoVideo
            id={item.id}
            forceMissing={item.forceMissing}
            className="aspect-video w-full"
          />
        )}
        <p className="border-t border-rule bg-surface px-4 py-3 text-label text-ink-muted">
          {item.type === "image" ? item.alt : item.label} · {index + 1}/
          {items.length}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function GalleryLightbox({
  items,
  openIndex,
  onClose,
}: {
  items: GalleryItem[];
  openIndex: number | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {openIndex !== null ? (
        <LightboxInner
          key={openIndex}
          items={items}
          initialIndex={openIndex}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}
