export const BRAND = {
  name: "2HANDS",
  tagline: "Wet job. Dry hands.",
  productName: "Waterproof Detailing Inner Glove",
  sku: "WDIG-001",
  colorway: "BLK-01",
} as const;

export const PRICE_USD = 29.99;

export type BundleId = "single" | "mitt" | "crew";

export type BundleOffer = {
  id: BundleId;
  name: string;
  priceUsd: number;
  enabled: boolean;
  pairs: number;
  note: string;
};

/** Single pair stays the default. Mitt stays hidden until MITT_SKU_AVAILABLE. */
export const BUNDLES: readonly BundleOffer[] = [
  {
    id: "single",
    name: "Single pair",
    priceUsd: PRICE_USD,
    enabled: true,
    pairs: 1,
    note: "One pair.",
  },
  {
    id: "mitt",
    name: "Glove plus exterior wash mitt",
    priceUsd: 0,
    enabled: false,
    pairs: 1,
    note: "Shown when the mitt is in stock.",
  },
  {
    id: "crew",
    name: "Two-pair crew pack",
    priceUsd: 51.99,
    enabled: true,
    pairs: 2,
    note: "One pair can dry while you wear the other.",
  },
];

export const MITT_SKU_AVAILABLE = false;

/** L and XL stay unconfirmed until fit trials. Do not auto-scale M. */
export const SIZES_CONFIRMED = false;

/** Owner must replace this with a real date range before it is shown. */
export const SHIP_WINDOW = "Ship window not set";

export const REFUND_PROMISE_SHORT =
  "Full refund any time before it ships. Full refund if we miss the date.";

export const REFUND_PROMISE_LONG =
  "Full refund any time before it ships. Full refund if we miss the ship date.";

export const EXCHANGE_POLICY_TEXT =
  "Free size exchange within 30 days of delivery for gloves that are unworn, rinsed and dry.";

/** Stripe Checkout uses mode payment, so the card is charged at checkout. */
export const PREORDER_CHARGE_TIMING =
  "Your card is charged when you place the pre-order.";

export const PRICE_RANGE_USD = {
  min: 26.99,
  max: 29.99,
} as const;

export type SalesMode = "preorder" | "live";
export const SALES_MODE: SalesMode = "preorder";

export type ClaimLevel = "intent" | "proven";
export const CLAIM_LEVEL: ClaimLevel = "intent";

/** Show "Concept visualization" captions on illustrative / AI video. */
export const SHOW_CONCEPT_LABEL = true;

export const SHIPPING_FLAT_USD = 4.99;
export const FREE_SHIPPING_OVER_USD = 40;
export const SHIP_ESTIMATE_TEXT =
  "Pre-order ships after fit-trial lock and first production run. Estimate shared by email.";

export type PaymentProviderId = "mock" | "stripe";
/** Prefer NEXT_PUBLIC_ so client UI (checkout CTA) matches the server provider. */
export const PAYMENT_PROVIDER: PaymentProviderId =
  (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProviderId) ||
  (process.env.PAYMENT_PROVIDER as PaymentProviderId) ||
  "mock";

export const SURVEY_FOOTNOTE =
  "Detailers and enthusiasts from WA, OR, CA, TX, FL, MI, KS, IN.";

/** Partnership / wholesale inquiries — swap later for a brand inbox. */
export const PARTNERSHIP_EMAIL = "amoghjain71@gmail.com";

export const HOME_NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#spec", label: "Spec" },
  { href: "/#sizing", label: "Sizing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/glove", label: "The glove" },
  { href: "/how-its-made", label: "How it's made" },
  { href: "/sizing", label: "Sizing" },
  { href: "/tested", label: "Tested" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
