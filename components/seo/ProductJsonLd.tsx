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
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    description:
      "A thin waterproof inner glove designed to live under a wash mitt. Sold as one left plus one right glove per pair.",
    image: [
      `${SITE.url}/images/glove/01-back-of-hand.jpg`,
      `${SITE.url}/images/glove/04-water-beading.jpg`,
      `${SITE.url}/images/glove/02-pair-flat-lay.jpg`,
      `${SITE.url}/images/glove/03-palm-view.jpg`,
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: PRICE_USD.toFixed(2),
      availability:
        SALES_MODE === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      url: SITE.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
