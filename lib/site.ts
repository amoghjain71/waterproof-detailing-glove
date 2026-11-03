import { BRAND } from "@/lib/config";

/** Canonical site URL — override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://2hands.local";

export const SITE = {
  url: SITE_URL,
  name: BRAND.name,
  productName: BRAND.productName,
  description:
    "A thin waterproof inner glove designed to live under your wash mitt. Wet job. Dry hands.",
  ogImage: "/images/glove-in-use.png",
  twitterHandle: "@2hands",
} as const;

export const SITEMAP_ROUTES = [
  "/",
  "/glove",
  "/how-its-made",
  "/sizing",
  "/tested",
  "/faq",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/legal/shipping",
  "/legal/returns",
  "/legal/privacy",
  "/legal/terms",
] as const;
