import {
  BRAND,
  PRICE_USD,
  SALES_MODE,
} from "@/lib/config";
import { SITE } from "@/lib/site";

export function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: BRAND.productName,
    sku: BRAND.sku,
    color: BRAND.colorway,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    description:
      "A thin waterproof inner glove designed to live under a wash mitt. Sold as one left plus one right glove per pair.",
    image: [
      `${SITE.url}/images/glove-concept.png`,
      `${SITE.url}/images/glove-in-use.png`,
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: PRICE_USD.toFixed(2),
      availability:
        SALES_MODE === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      url: `${SITE.url}/glove`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
