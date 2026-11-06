"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BUNDLES, EXCHANGE_POLICY_TEXT, REFUND_PROMISE_SHORT, SHIP_WINDOW, type BundleId } from "@/lib/config";
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ground">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <Image
          src="/images/glove/01-back-of-hand.jpg"
          alt=""
          width={96}
          height={96}
          className="h-12 w-12 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-label text-ink">{formatUsd(bundle.priceUsd)}</p>
          <p className="text-label text-ink-muted">
            Size {size} · {bundle.name}
          </p>
          <p className="text-label text-ink-muted">
            {SHIP_WINDOW}. {REFUND_PROMISE_SHORT} {EXCHANGE_POLICY_TEXT}
          </p>
        </div>
        <Button href="#buy">Pre-order</Button>
      </div>
    </div>
  );
}
