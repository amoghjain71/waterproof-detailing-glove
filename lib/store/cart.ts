"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SizeCode } from "@/data/sizes";
import { BRAND } from "@/lib/config";
import { canonicalSku, displayUnitPriceUsd } from "@/lib/catalog";
import type { CartItem } from "@/lib/store/cart-types";

export type { CartItem };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: { size: SizeCode; qty?: number; sku?: string }) => void;
  setQty: (sku: string, size: SizeCode, qty: number) => void;
  removeItem: (sku: string, size: SizeCode) => void;
  clear: () => void;
  count: () => number;
  /** Display subtotal from catalog prices — never sent to the server as authority. */
  subtotal: () => number;
};

function normalizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const next: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const sku =
      typeof row.sku === "string" ? canonicalSku(row.sku) : BRAND.sku;
    const size = row.size;
    const qty = Number(row.qty);
    if (size !== "M" && size !== "L" && size !== "XL") continue;
    if (!Number.isFinite(qty) || qty < 1) continue;
    next.push({ sku, size, qty: Math.min(10, Math.floor(qty)) });
  }
  return next;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: ({ size, qty = 1, sku = BRAND.sku }) => {
        const canonical = canonicalSku(sku);
        const addQty = Math.min(10, Math.max(1, qty));
        set((state) => {
          const existing = state.items.find(
            (i) => i.size === size && i.sku === canonical,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.size === size && i.sku === canonical
                  ? { ...i, qty: Math.min(10, i.qty + addQty) }
                  : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { sku: canonical, size, qty: addQty }],
            isOpen: true,
          };
        });
      },
      setQty: (sku, size, qty) => {
        if (qty <= 0) {
          get().removeItem(sku, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.sku === sku && i.size === size
              ? { ...i, qty: Math.min(10, qty) }
              : i,
          ),
        }));
      },
      removeItem: (sku, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.sku === sku && i.size === size)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () =>
        get().items.reduce(
          (n, i) => n + i.qty * displayUnitPriceUsd(i.sku),
          0,
        ),
    }),
    {
      name: "2hands-cart",
      partialize: (state) => ({
        items: state.items.map(({ sku, size, qty }) => ({ sku, size, qty })),
      }),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object"
            ? (persisted as { items?: unknown }).items
            : undefined;
        return {
          ...current,
          items: normalizeItems(raw),
        };
      },
    },
  ),
);
