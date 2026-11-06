import type { SizeCode } from "@/data/sizes";

export type CartItem = {
  sku: string;
  size: SizeCode;
  qty: number;
  price: number;
  label?: string;
};
