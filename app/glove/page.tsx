import type { Metadata } from "next";
import { GloveProduct } from "@/components/glove/GloveProduct";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: BRAND.productName,
  description:
    "A thin waterproof inner glove designed to live under your wash mitt. Pre-order a pair.",
};

export default function GlovePage() {
  return (
    <>
      <ProductJsonLd />
      <GloveProduct />
    </>
  );
}
