import "server-only";

import { BUNDLES, BRAND, PRICE_USD } from "@/lib/config";
import { canonicalSku } from "@/lib/catalog";

/** Server-side price lookup — never trust client amounts. */
export function unitPriceUsdForSku(sku: string): number {
  const id = canonicalSku(sku);
  if (id === BRAND.sku) return PRICE_USD;
  const bundle = BUNDLES.find((item) => item.id === id && item.enabled);
  if (bundle) return bundle.priceUsd;
  throw new Error("Unknown SKU");
}
