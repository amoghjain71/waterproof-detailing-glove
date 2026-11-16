import {
  FREE_SHIPPING_OVER_USD,
  PREORDER_CHARGE_TIMING,
} from "@/lib/config";
import { formatUsd } from "@/lib/utils";

/** Checkout / cart disclosures. Refund and exchange detail also live in FAQ. */
export function PreorderTerms() {
  return (
    <ul className="space-y-2 text-label text-ink-muted">
      <li>{PREORDER_CHARGE_TIMING}</li>
    </ul>
  );
}

export function ShippingMeter({ subtotal }: { subtotal: number }) {
  const ratio = Math.min(1, subtotal / FREE_SHIPPING_OVER_USD);
  const left = Math.max(0, FREE_SHIPPING_OVER_USD - subtotal);

  return (
    <div className="mt-4">
      <p className="text-label text-ink">
        {left === 0
          ? "Free shipping on this order."
          : `${formatUsd(left)} away from free shipping.`}
      </p>
      <div className="mt-2 h-1 bg-rule" aria-hidden>
        <div className="h-1 bg-ink" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
    </div>
  );
}
