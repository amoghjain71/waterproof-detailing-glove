"use client";

import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart";
import { PreorderTerms, ShippingMeter } from "@/components/commerce/OfferNotes";
import { orderTotal } from "@/lib/commerce";
import { displayUnitPriceUsd, labelForSku } from "@/lib/catalog";
import { BRAND } from "@/lib/config";
import { formatUsd } from "@/lib/utils";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal());
  const { shipping, total } = orderTotal(subtotal);

  return (
    <div>
      <PageHero
        title="Cart"
        description={`Review your ${BRAND.productName} pairs before checkout.`}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        {items.length === 0 ? (
          <div className="border border-rule p-10">
            <p className="text-ink-muted">No items yet.</p>
            <Button href="/glove" className="mt-6">
              Shop the glove
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:split-7-5">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.sku}-${item.size}`}
                  className="rounded border border-rule bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {labelForSku(item.sku)} · Size {item.size}
                      </p>
                      <p className="mt-1 text-label text-ink-muted">
                        {formatUsd(displayUnitPriceUsd(item.sku))}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-label text-ink-muted hover:text-brand"
                      onClick={() => removeItem(item.sku, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-3 rounded border border-rule px-3 py-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.sku, item.size, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-label">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.sku, item.size, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">
                      {formatUsd(displayUnitPriceUsd(item.sku) * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded border border-rule p-6">
              <dl className="space-y-2 text-label">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd>{formatUsd(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatUsd(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-rule pt-2 font-medium">
                  <dt>Total</dt>
                  <dd>{formatUsd(total)}</dd>
                </div>
              </dl>
              <ShippingMeter subtotal={subtotal} />
              <div className="mt-4">
                <PreorderTerms />
              </div>
              <Button href="/checkout" className="mt-6 w-full">
                Checkout
              </Button>
              <Link
                href="/glove"
                className="mt-3 block text-center text-label text-brand"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
