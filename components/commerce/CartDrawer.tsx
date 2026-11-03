"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/store/cart";
import { orderTotal } from "@/lib/commerce";
import { SALES_MODE, SHIP_ESTIMATE_TEXT } from "@/lib/config";
import { formatUsd, FRAMER_EASE } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal());
  const { shipping, total } = orderTotal(subtotal);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[110] bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[120] flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: FRAMER_EASE }}
            role="dialog"
            aria-modal
            aria-label="Cart"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl uppercase tracking-tight">
                Cart
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted">Your bag is empty.</p>
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
                        className="rounded-xl border border-border bg-glass p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">
                              Inner Glove · Size {item.size}
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
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQty(item.size, item.qty - 1)}
                            >
                              −
                            </button>
                            <span className="min-w-5 text-center text-sm">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQty(item.size, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatUsd(item.price * item.qty)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-border px-5 py-5">
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
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-3 flex w-full items-center justify-center text-sm text-cyan"
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
