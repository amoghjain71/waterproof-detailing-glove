import {
  FREE_SHIPPING_OVER_USD,
  SHIPPING_FLAT_USD,
} from "@/lib/config";

export function shippingForSubtotal(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_OVER_USD) return 0;
  return SHIPPING_FLAT_USD;
}

export function orderTotal(subtotal: number): {
  shipping: number;
  total: number;
} {
  const shipping = shippingForSubtotal(subtotal);
  return { shipping, total: subtotal + shipping };
}
