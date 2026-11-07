import { z } from "zod";
import { BUNDLES, BRAND, type BundleId } from "@/lib/config";

const sizeSchema = z.enum(["S", "M", "L", "XL"]);

/** Honeypot + timing — allow filled honeypot through zod so the route can soft-succeed. */
const abuseFields = {
  website: z.string().max(200).optional().default(""),
  formStartedAt: z.number().optional(),
};

export const waitlistSchema = z
  .object({
    email: z.string().email().max(254),
    size: sizeSchema.optional(),
    source: z.string().max(80).optional(),
    ...abuseFields,
  })
  .strict();

export const contactSchema = z
  .object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(254),
    topic: z.string().max(60).optional(),
    message: z.string().min(5).max(5000),
    ...abuseFields,
  })
  .strict();

export const checkoutCustomerSchema = z
  .object({
    email: z.string().email().max(254),
    name: z.string().min(1).max(120),
    phone: z.string().max(40).optional(),
    address: z
      .object({
        line1: z.string().min(1).max(200),
        line2: z.string().max(200).optional(),
        city: z.string().min(1).max(100),
        state: z.string().min(1).max(100),
        postalCode: z.string().min(3).max(20),
        country: z.string().length(2),
      })
      .strict(),
  })
  .strict();

const allowedSkus = new Set<string>([
  BRAND.sku,
  ...BUNDLES.filter((b) => b.enabled).map((b) => b.id),
]);

export const cartItemSchema = z
  .object({
    sku: z.string().refine((sku) => allowedSkus.has(sku), "Unknown SKU"),
    size: sizeSchema,
    qty: z.number().int().min(1).max(10),
  })
  .strict();

export const attributionSchema = z
  .object({
    src: z.string().max(80).optional(),
    utm_source: z.string().max(80).optional(),
    utm_medium: z.string().max(80).optional(),
    utm_campaign: z.string().max(80).optional(),
    utm_content: z.string().max(80).optional(),
    utm_term: z.string().max(80).optional(),
  })
  .strict();

export const checkoutRequestSchema = z
  .object({
    customer: checkoutCustomerSchema,
    cart: z.array(cartItemSchema).min(1).max(20),
    waitlistEmail: z.string().email().max(254).optional(),
    attribution: attributionSchema.optional(),
    ...abuseFields,
  })
  .strict();

export type CheckoutCartItem = z.infer<typeof cartItemSchema>;

export function isBundleId(value: string): value is BundleId {
  return BUNDLES.some((b) => b.id === value);
}
