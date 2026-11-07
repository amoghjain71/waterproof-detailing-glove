import type { SizeCode } from "@/data/sizes";

/** Persisted cart shape — sku, size, qty only. Never trust price from storage. */
export type CartItem = {
  sku: string;
  size: SizeCode;
  qty: number;
};
