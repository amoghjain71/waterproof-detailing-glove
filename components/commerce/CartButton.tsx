"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/store/cart";
import { Swap } from "@/components/ui/Swap";
import { cn } from "@/lib/utils";

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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.5" fill="currentColor" />
        <circle cx="17" cy="20" r="1.5" fill="currentColor" />
      </svg>
      <span className="absolute -right-1 -top-1">
        <Swap swapKey={count > 0 ? `n-${count}` : "empty"} scaleFrom={0.25}>
          <span
            className={cn(
              "cart-badge flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-label font-semibold",
              count > 0
                ? "bg-brand text-on-brand"
                : "border border-rule bg-surface text-ink",
            )}
          >
            {count}
          </span>
        </Swap>
      </span>
    </button>
  );
}
