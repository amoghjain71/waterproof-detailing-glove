"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store/cart";

function subscribe(onStoreChange: () => void) {
  return useCart.subscribe(onStoreChange);
}

function getCount() {
  return useCart.getState().items.reduce((n, i) => n + i.qty, 0);
}

function getServerCount() {
  return 0;
}

export function CartButton() {
  const openCart = useCart((s) => s.openCart);
  const count = useSyncExternalStore(subscribe, getCount, getServerCount);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex h-12 w-12 items-center justify-center border border-rule bg-surface text-label"
      aria-label={`Cart, ${count} items`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.7L5.2 3.5H2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.2" fill="currentColor" />
        <circle cx="17" cy="20" r="1.2" fill="currentColor" />
      </svg>
      <AnimatePresence>
        {count > 0 ? (
          <motion.span
            key={count}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            className="cart-badge absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-label font-semibold text-on-brand"
          >
            {count}
          </motion.span>
        ) : (
          <span className="cart-badge absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-rule bg-surface px-1 text-label font-semibold text-ink">
            0
          </span>
        )}
      </AnimatePresence>
    </button>
  );
}
