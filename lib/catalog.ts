import { BUNDLES, BRAND, PRICE_USD } from "@/lib/config";

/** Client-safe catalog helpers for display only. Server checkout uses lib/commerce-price.ts. */

export function labelForSku(sku: string): string {
  if (sku === BRAND.sku || sku === "single") return BRAND.productName;
  const bundle = BUNDLES.find((item) => item.id === sku);
  return bundle?.name ?? BRAND.productName;
}

export function displayUnitPriceUsd(sku: string): number {
  if (sku === BRAND.sku || sku === "single") return PRICE_USD;
  const bundle = BUNDLES.find((item) => item.id === sku && item.enabled);
  return bundle?.priceUsd ?? PRICE_USD;
}

/** Normalize cart SKUs so checkout allowlists match catalog IDs. */
export function canonicalSku(sku: string): string {
  if (sku === "single" || sku === BRAND.sku) return BRAND.sku;
  if (sku.startsWith("2hands-")) {
    const id = sku.slice("2hands-".length);
    if (BUNDLES.some((b) => b.id === id)) return id;
  }
  return sku;
}
