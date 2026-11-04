"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GalleryLightbox,
  type GalleryItem,
} from "@/components/glove/GalleryLightbox";
import { ProductGallery } from "@/components/glove/ProductGallery";
import { SizeDrawer } from "@/components/glove/SizeDrawer";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { Button } from "@/components/ui/Button";
import { SIZE_CHART, type SizeCode } from "@/data/sizes";
import {
  BRAND,
  FREE_SHIPPING_OVER_USD,
  PRICE_USD,
  SALES_MODE,
  SHIPPING_FLAT_USD,
  SHIP_ESTIMATE_TEXT,
} from "@/lib/config";
import { useCart } from "@/lib/store/cart";
import { cn, formatUsd, FRAMER_EASE } from "@/lib/utils";

const GALLERY: Extract<GalleryItem, { type: "image" }>[] = [
  {
    type: "image",
    src: "/images/glove/01-back-of-hand.jpg",
    alt: "Back of hand with 2Hands mark and wrist strap",
  },
  {
    type: "image",
    src: "/images/glove/02-pair-flat-lay.jpg",
    alt: "Pair flat lay — one strap open, one closed",
  },
  {
    type: "image",
    src: "/images/glove/03-palm-view.jpg",
    alt: "Palm view with low-profile branding",
  },
  {
    type: "image",
    src: "/images/glove/04-water-beading.jpg",
    alt: "Water beading on the matte outer shell",
  },
  {
    type: "image",
    src: "/images/glove/05-flexibility.jpg",
    alt: "Flex views — closed fist and open fingers",
  },
  {
    type: "image",
    src: "/images/glove/06-strap-open-closed.jpg",
    alt: "Hook-and-loop strap open vs closed",
  },
  {
    type: "image",
    src: "/images/glove/07-cuff-strap.jpg",
    alt: "Cuff and strap close-up",
  },
  {
    type: "image",
    src: "/images/glove/08-inside-cuff.jpg",
    alt: "Inside lining and silicone sealing lip",
  },
  {
    type: "image",
    src: "/images/glove/09-material-layers.jpg",
    alt: "Three-layer laminate cross-section",
  },
  {
    type: "image",
    src: "/images/glove/10-packaging.jpg",
    alt: "Pair with packaging card and envelope",
  },
];

const SPEC_ITEMS = [
  {
    title: "Construction",
    body: "Three-layer laminate: matte-black stretch nylon outer, 1.0 mm closed-cell neoprene core, smooth polyester tricot inner. Seams bonded and sealed. No exposed metal or abrasive hardware, no raised grip texture.",
  },
  {
    title: "Cuff & closure",
    body: "60 mm cuff with soft silicone sealing lip inside. Adjustable 25 mm low-profile hook-and-loop strap designed to sit under the wash mitt so it cannot scratch paint.",
  },
  {
    title: "Fit",
    body: "Five-finger articulated fit with flexible fingers and minimal seam bulk. Built to live underneath a standard microfiber wash mitt. Sold as one left + one right per pair.",
  },
] as const;

type TabId = "details" | "materials" | "care" | "shipping";

export function GloveProduct() {
  const [size, setSize] = useState<SizeCode>("M");
  const [qty, setQty] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [openSpec, setOpenSpec] = useState(0);
  const [tab, setTab] = useState<TabId>("details");
  const addItem = useCart((s) => s.addItem);

  const selected = SIZE_CHART.find((s) => s.code === size);

  function onAdd() {
    addItem({ size, qty, price: PRICE_USD, sku: BRAND.sku });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div>
      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PrototypeBadge className="mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-cyan">
            {BRAND.sku} · {BRAND.colorway}
          </p>
          <h1 className="font-display mt-3 text-4xl uppercase tracking-tight sm:text-5xl lg:text-6xl">
            {BRAND.productName}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            A thin waterproof inner glove designed to live under your wash mitt.
            Put it on once. Swap mitts in seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <ProductGallery items={GALLERY} onExpand={setLightbox} />

        <aside className="h-fit rounded-2xl border border-border bg-glass p-6 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan">
            {SALES_MODE === "preorder" ? "Pre-order" : "In stock"}
          </p>
          <p className="mt-3 font-display text-4xl">{formatUsd(PRICE_USD)}</p>
          <p className="mt-1 text-sm text-muted">Per pair · left + right</p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Size</p>
              <button
                type="button"
                className="text-xs text-cyan hover:underline"
                onClick={() => setDrawerOpen(true)}
              >
                Which size?
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZE_CHART.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setSize(s.code)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    size === s.code
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted hover:text-foreground",
                  )}
                >
                  {s.code}
                  {s.status === "pending" ? " · soon" : ""}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">{selected?.note}</p>
          </div>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border px-3 py-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="btn-ripple relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: FRAMER_EASE }}
                  className="relative z-10 inline-flex items-center gap-2"
                >
                  <span className="inline-block h-4 w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-cyan" />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="cta"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: FRAMER_EASE }}
                  className="relative z-10"
                >
                  {SALES_MODE === "preorder" ? "Pre-order" : "Add to cart"} ·{" "}
                  {formatUsd(PRICE_USD * qty)}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <p className="mt-3 text-xs text-muted">
            {SALES_MODE === "preorder"
              ? SHIP_ESTIMATE_TEXT
              : "Ships according to the shipping policy at checkout."}
          </p>

          <div className="mt-8 space-y-2 border-t border-border pt-6">
            {SPEC_ITEMS.map((item, i) => {
              const open = openSpec === i;
              return (
                <div key={item.title} className="rounded-xl border border-border">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                    aria-expanded={open}
                    onClick={() => setOpenSpec(open ? -1 : i)}
                  >
                    {item.title}
                    <span className="text-cyan">{open ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: FRAMER_EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm leading-relaxed text-muted">
                          {item.body}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {(
              [
                ["details", "Details"],
                ["materials", "Materials"],
                ["care", "Care"],
                ["shipping", "Shipping"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm",
                  tab === id
                    ? "bg-accent text-white"
                    : "border border-border text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm leading-relaxed text-muted">
            {tab === "details" ? (
              <p>
                SKU {BRAND.sku}, colorway {BRAND.colorway} matte black. Five-finger
                articulated fit designed to stay thin under any standard wash mitt.
                Engineered cuff seal with silicone lip and 25 mm strap. Intent
                language only — Prototype V2 testing is in progress.
              </p>
            ) : null}
            {tab === "materials" ? (
              <ul className="space-y-3">
                <li>Outer: matte-black stretch nylon, water-repellent surface</li>
                <li>Core: closed-cell neoprene foam, target 1.0 mm</li>
                <li>Inner: smooth low-friction polyester tricot</li>
                <li>Seams: bonded and sealed</li>
                <li>Cuff lip: soft silicone · Strap: 25 mm hook-and-loop</li>
              </ul>
            ) : null}
            {tab === "care" ? (
              <p>
                Draft until validated: rinse with clean cool water after use,
                air-dry fully inside and outside away from direct heat. Do not
                wring, iron, or tumble dry.
              </p>
            ) : null}
            {tab === "shipping" ? (
              <p>
                Flat shipping {formatUsd(SHIPPING_FLAT_USD)}. Free over{" "}
                {formatUsd(FREE_SHIPPING_OVER_USD)}. {SHIP_ESTIMATE_TEXT}
              </p>
            ) : null}
          </div>

          <Button href="/how-its-made" variant="outline" className="mt-8">
            See how it&apos;s made
          </Button>
        </div>
      </section>

      <SizeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRecommend={(code) => {
          if (code) setSize(code);
        }}
      />
      <GalleryLightbox
        items={GALLERY}
        openIndex={lightbox}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
