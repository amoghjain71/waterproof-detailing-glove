"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryLightbox, type GalleryItem } from "@/components/glove/GalleryLightbox";
import { ProductGallery } from "@/components/glove/ProductGallery";
import { BuyModule } from "@/components/home/BuyModule";
import { CompareSection } from "@/components/home/CompareSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MediaNote } from "@/components/media/MediaNote";
import type { SizeCode } from "@/data/sizes";
import { IMAGE_SLOTS, type ImageSlotId } from "@/content/images";
import {
  EXCHANGE_POLICY_TEXT,
  FREE_SHIPPING_OVER_USD,
  REFUND_PROMISE_SHORT,
  SHIP_WINDOW,
  SHIPPING_FLAT_USD,
  type BundleId,
} from "@/lib/config";
import { formatUsd } from "@/lib/utils";

const PHOTO_IDS: ImageSlotId[] = [
  "back-of-hand",
  "palm",
  "pair",
  "cuff",
  "inside",
  "beading",
  "packaging",
];

const GALLERY: GalleryItem[] = [
  ...PHOTO_IDS.flatMap((id) => {
    const slot = IMAGE_SLOTS[id];
    if (!slot.src) return [];
    return [{ type: "image" as const, src: slot.src, alt: slot.alt }];
  }),
  {
    type: "video",
    id: "mitt-swap",
    label: "A mitt sliding over the glove",
  },
];

const BENEFITS = [
  "Put it on once. Swap mitts for the rest of the wash.",
  "Designed to keep bucket water off your hands.",
  "The 25 mm strap sits under the mitt, away from the paint.",
];

const SPEC = [
  ["Outer", "Matte black stretch nylon. No grip dots."],
  ["Core", "1.0 mm closed-cell neoprene. Target thickness."],
  ["Inner", "Smooth polyester tricot."],
  ["Cuff", "Soft silicone lip and a 25 mm strap."],
  ["Seams", "Bonded and sealed. Through-stitching alone is not used."],
];

export function GloveProduct() {
  const router = useRouter();
  const [size, setSize] = useState<SizeCode>("M");
  const [bundleId, setBundleId] = useState<BundleId>("single");
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-chrome lg:col-span-7">
            <ProductGallery items={GALLERY} onExpand={setLightbox} />
            <MediaNote />
          </div>
          <div className="lg:col-span-5">
            <h1 className="font-display text-h2 text-ink">
              Waterproof detailing inner glove
            </h1>
            <p className="mt-4 text-body text-ink">
              A thin glove for under a wash mitt. Put it on once. Slide any mitt over it.
            </p>
            <ul className="mt-6 border-t border-rule">
              {BENEFITS.map((line) => (
                <li key={line} className="border-b border-rule py-3 text-body text-ink">
                  {line}
                </li>
              ))}
            </ul>
            <BuyModule
              size={size}
              bundleId={bundleId}
              onSize={setSize}
              onBundle={setBundleId}
              onOpenSizer={() => router.push("/sizing")}
            />
            <h2 className="mt-10 font-display text-h3">Spec</h2>
            <table className="mt-4 w-full border-collapse text-left text-body">
              <tbody>
                {SPEC.map((row) => (
                  <tr key={row[0]} className="border-t border-rule">
                    <th className="py-3 pr-4 text-label font-medium">{row[0]}</th>
                    <td className="py-3 text-ink-muted">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="mt-10 font-display text-h3">In the box</h2>
            <p className="mt-3 text-body text-ink">One left glove and one right glove.</p>
            <h2 className="mt-10 font-display text-h3">Care</h2>
            <p className="mt-3 text-body text-ink-muted">
              Draft until care tests pass: rinse with cool water, then air-dry inside and
              out. Do not wring, iron, or tumble dry.
            </p>
            <h2 className="mt-10 font-display text-h3">Shipping</h2>
            <ul className="mt-3 space-y-2 text-body text-ink-muted">
              <li>{SHIP_WINDOW}.</li>
              <li>
                {formatUsd(SHIPPING_FLAT_USD)} shipping. Free over{" "}
                {formatUsd(FREE_SHIPPING_OVER_USD)}.
              </li>
              <li>{REFUND_PROMISE_SHORT}</li>
              <li>{EXCHANGE_POLICY_TEXT}</li>
            </ul>
          </div>
        </div>
      </section>
      <HowItWorks washVideo="bucket-dip-dry-reveal" />
      <CompareSection />
      <HomeFaqSection />
      <GalleryLightbox items={GALLERY} openIndex={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
