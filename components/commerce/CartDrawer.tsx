"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/store/cart";
import { PreorderTerms, ShippingMeter } from "@/components/commerce/OfferNotes";
import { orderTotal } from "@/lib/commerce";
import { displayUnitPriceUsd, labelForSku } from "@/lib/catalog";
import { BUNDLES, BRAND, MITT_SKU_AVAILABLE } from "@/lib/config";
import { formatUsd, FRAMER_EASE } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const addItem = useCart((s) => s.addItem);
  const subtotal = useCart((s) => s.subtotal());
  const { shipping, total } = orderTotal(subtotal);
  const mitt = BUNDLES.find((bundle) => bundle.id === "mitt");
  const onlySingle =
    items.length > 0 && items.every((item) => item.sku === BRAND.sku);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-overlay bg-ground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-drawer flex w-full max-w-md flex-col border-l border-rule bg-ground"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: FRAMER_EASE }}
            role="dialog"
            aria-modal
            aria-label="Cart"
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-4">
              <h2 className="font-display text-h3">
                Cart
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="h-12 border border-rule px-4 text-label"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-label text-ink-muted">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={`${item.sku}-${item.size}`}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        className="rounded border border-rule bg-surface p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-label font-medium">
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
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-rule">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="h-12 w-12"
                              onClick={() => setQty(item.sku, item.size, item.qty - 1)}
                            >
                              −
                            </button>
                            <span className="min-w-5 text-center text-label">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="h-12 w-12"
                              onClick={() => setQty(item.sku, item.size, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-label font-medium">
                            {formatUsd(
                              displayUnitPriceUsd(item.sku) * item.qty,
                            )}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-rule px-5 py-5">
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
              {MITT_SKU_AVAILABLE && mitt?.enabled && onlySingle ? (
                <button
                  type="button"
                  className="mt-4 h-12 w-full border border-ink text-label"
                  onClick={() =>
                    addItem({
                      size: items[0]?.size ?? "M",
                      qty: 1,
                      sku: mitt.id,
                    })
                  }
                >
                  Add a wash mitt, {formatUsd(mitt.priceUsd)}
                </button>
              ) : null}
              <div className="mt-4">
                <PreorderTerms />
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex h-12 w-full items-center justify-center bg-brand px-6 text-label font-medium text-on-brand"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-3 flex w-full items-center justify-center text-label text-brand"
              >
                View full cart
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
