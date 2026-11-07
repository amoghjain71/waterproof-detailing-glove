"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BUNDLES, type BundleId } from "@/lib/config";
import type { SizeCode } from "@/data/sizes";
import { Button } from "@/components/ui/Button";
import { formatUsd } from "@/lib/utils";

export function StickyBuyBar({
  size,
  bundleId,
}: {
  size: SizeCode;
  bundleId: BundleId;
}) {
  const [visible, setVisible] = useState(false);
  const bundle = BUNDLES.find((item) => item.id === bundleId) ?? BUNDLES[0];

  useEffect(() => {
    const target = document.querySelector("[data-buy-module='hero']");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setVisible(entry.boundingClientRect.bottom < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible || !bundle) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ground pb-safe">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src="/images/glove/01-back-of-hand.jpg"
            alt=""
            width={96}
            height={96}
            className="h-12 w-12 shrink-0 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-label text-ink">{formatUsd(bundle.priceUsd)}</p>
            <p className="text-label text-ink-muted">
              Size {size} · {bundle.name}
            </p>
          </div>
        </div>
        <Button href="#buy" className="w-full shrink-0 sm:w-auto">
          Pre-order
        </Button>
      </div>
    </div>
  );
}
