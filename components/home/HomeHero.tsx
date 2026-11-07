"use client";

import Link from "next/link";
import type { SizeCode } from "@/data/sizes";
import type { BundleId } from "@/lib/config";
import { BuyModule } from "@/components/home/BuyModule";
import { ProductViewer } from "@/components/home/ProductViewer";

const FACTS = [
  "About 9 in 10 of 62 surveyed detailers get cold, wet hands.",
  "Target finished laminate of 1.8 mm or thinner.",
  "The strap sits under the mitt, away from the paint.",
];

export function HomeHero({
  size,
  bundleId,
  onSize,
  onBundle,
  onOpenSizer,
}: {
  size: SizeCode;
  bundleId: BundleId;
  onSize: (size: SizeCode) => void;
  onBundle: (id: BundleId) => void;
  onOpenSizer: () => void;
}) {
  return (
    <section id="buy" className="px-4 py-8 sm:px-6 lg:min-h-fold lg:px-8 lg:pb-6 lg:pt-4">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ProductViewer />
          <ul className="relative z-10 mt-6 border-t border-rule">
            {FACTS.map((fact) => (
              <li key={fact} className="border-b border-rule py-3 text-label text-ink">
                {fact}
              </li>
            ))}
          </ul>
          <p className="relative z-10 mt-8 max-w-md text-label text-ink-muted">
            Materials include nylon, CR neoprene, polyester tricot, and a silicone
            cuff lip. Not for kids under 14. Read{" "}
            <Link href="/faq" className="text-brand">
              materials, allergens, refunds, and exchanges
            </Link>{" "}
            in FAQ.
          </p>
        </div>
        <div className="lg:col-span-5">
          <p className="relative z-10 text-label text-ink-muted">
            Waterproof inner glove for car detailing
          </p>
          <h1
            data-path-point
            className="relative z-10 mt-2 font-display text-h1 text-ink"
          >
            A waterproof glove that goes under your wash mitt.
          </h1>
          <p className="relative z-10 mt-2 max-w-xl text-lead text-ink">
            Put it on once. Slide any wash mitt over it and swap mitts all wash. Designed to
            keep bucket water off your hands.
          </p>
          <div className="relative z-10">
            <BuyModule
              size={size}
              bundleId={bundleId}
              onSize={onSize}
              onBundle={onBundle}
              onOpenSizer={onOpenSizer}
              observe
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}
