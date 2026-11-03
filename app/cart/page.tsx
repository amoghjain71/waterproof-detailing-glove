"use client";

import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart";
import { orderTotal } from "@/lib/commerce";
import { BRAND, SALES_MODE, SHIP_ESTIMATE_TEXT } from "@/lib/config";
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
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted">No items yet.</p>
            <Button href="/glove" className="mt-6">
              Shop the glove
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.sku}-${item.size}`}
                  className="rounded-2xl border border-border bg-glass p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {BRAND.productName} · Size {item.size}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {item.sku} · {formatUsd(item.price)} / pair
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-muted hover:text-cyan"
                      onClick={() => removeItem(item.size)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-3 rounded-full border border-border px-3 py-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.size, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.size, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">
                      {formatUsd(item.price * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border p-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatUsd(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatUsd(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-medium">
                  <dt>Total</dt>
                  <dd>{formatUsd(total)}</dd>
                </div>
              </dl>
              {SALES_MODE === "preorder" ? (
                <p className="mt-3 text-xs text-muted">{SHIP_ESTIMATE_TEXT}</p>
              ) : null}
              <Button href="/checkout" magnetic className="mt-6 w-full">
                Checkout
              </Button>
              <Link
                href="/glove"
                className="mt-3 block text-center text-sm text-cyan"
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
