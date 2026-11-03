export const BRAND = {
  name: "2Hands",
  tagline: "Wet job. Dry hands.",
  productName: "Waterproof Detailing Inner Glove",
  sku: "WDIG-001",
  colorway: "BLK-01",
} as const;

/** Planned retail target. Keep in sync with copy. */
export const PRICE_USD = 24.99;

export const PRICE_RANGE_USD = {
  min: 21.99,
  max: 24.99,
} as const;

export type SalesMode = "preorder" | "live";
export const SALES_MODE: SalesMode = "preorder";

export type ClaimLevel = "intent" | "proven";
export const CLAIM_LEVEL: ClaimLevel = "intent";

/** Show "Concept visualization" captions on illustrative / AI video. */
export const SHOW_CONCEPT_LABEL = true;

export const SHIPPING_FLAT_USD = 4.99;
export const FREE_SHIPPING_OVER_USD = 50;
export const SHIP_ESTIMATE_TEXT =
  "Pre-order ships after fit-trial lock and first production run. Estimate shared by email.";

export type PaymentProviderId = "mock" | "stripe";
export const PAYMENT_PROVIDER: PaymentProviderId =
  (process.env.PAYMENT_PROVIDER as PaymentProviderId) || "mock";

export const SURVEY_FOOTNOTE =
  "Founder survey, n=62 detailers and enthusiasts (WA, OR, CA, TX, FL, MI, KS, IN).";

export const NAV_LINKS = [
  { href: "/glove", label: "The Glove" },
  { href: "/how-its-made", label: "How It's Made" },
  { href: "/sizing", label: "Sizing" },
  { href: "/tested", label: "Tested" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;
