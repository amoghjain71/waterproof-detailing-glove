"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SizeCode } from "@/data/sizes";
import { BRAND, PRICE_USD } from "@/lib/config";
import type { CartItem } from "@/lib/store/cart-types";

export type { CartItem };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: { size: SizeCode; qty?: number; price?: number; sku?: string }) => void;
  setQty: (size: SizeCode, qty: number) => void;
  removeItem: (size: SizeCode) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: ({ size, qty = 1, price = PRICE_USD, sku = BRAND.sku }) => {
        set((state) => {
          const existing = state.items.find((i) => i.size === size && i.sku === sku);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.size === size && i.sku === sku
                  ? { ...i, qty: i.qty + qty }
                  : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { sku, size, qty, price }],
            isOpen: true,
          };
        });
      },
      setQty: (size, qty) => {
        if (qty <= 0) {
          get().removeItem(size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.size === size ? { ...i, qty } : i)),
        }));
      },
      removeItem: (size) =>
        set((state) => ({
          items: state.items.filter((i) => i.size !== size),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    {
      name: "2hands-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
