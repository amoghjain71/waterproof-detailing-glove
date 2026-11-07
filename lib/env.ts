import "server-only";

import { z } from "zod";

const providerSchema = z.enum(["mock", "stripe"]);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  PAYMENT_PROVIDER: providerSchema.optional(),
  NEXT_PUBLIC_PAYMENT_PROVIDER: providerSchema.optional(),
  /** Set to "true" only when Stripe Checkout should accept real pre-orders. */
  PAYMENTS_OPEN: z.enum(["true", "false"]).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  /** Verified sender, e.g. "2HANDS <orders@yourdomain.com>" */
  EMAIL_FROM: z.string().min(3).optional(),
  /** Inbox for pre-order / waitlist lead alerts (email + phone). */
  LEAD_NOTIFY_EMAIL: z.string().email().optional(),
  /** Public origin for images in emails (must be reachable by Gmail, not localhost). */
  EMAIL_ASSET_BASE_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1).optional(),
  POSTGRES_URL: z.string().min(1).optional(),
  /** Secret for GET /api/admin/leads?key=… CSV export. */
  LEADS_EXPORT_SECRET: z.string().min(16).optional(),
});

export type AppEnv = z.infer<typeof envSchema> & {
  paymentProvider: "mock" | "stripe";
  siteUrl: string;
  paymentsOpen: boolean;
  isProduction: boolean;
};

function isProductionRuntime(parsed: z.infer<typeof envSchema>) {
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  return (
    parsed.NODE_ENV === "production" || parsed.VERCEL_ENV === "production"
  );
}

let cached: AppEnv | null = null;

/** Validated server env. Stripe secrets required when provider is stripe in production. */
export function getEnv(): AppEnv {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("Invalid environment configuration");
  }

  const paymentProvider =
    parsed.data.NEXT_PUBLIC_PAYMENT_PROVIDER ??
    parsed.data.PAYMENT_PROVIDER ??
    "mock";

  const siteUrl = (
    parsed.data.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const isProduction = isProductionRuntime(parsed.data);

  if (isProduction && paymentProvider === "stripe") {
    if (!parsed.data.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is required in production");
    }
    if (!parsed.data.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET is required in production");
    }
  }

  const paymentsOpen =
    paymentProvider === "stripe" &&
    Boolean(parsed.data.STRIPE_SECRET_KEY) &&
    parsed.data.PAYMENTS_OPEN === "true";

  cached = {
    ...parsed.data,
    paymentProvider,
    siteUrl,
    paymentsOpen,
    isProduction,
  };
  return cached;
}

/** Live Stripe Checkout is allowed only when explicitly opened. */
export function assertCheckoutAvailable():
  | { ok: true }
  | { ok: false; status: 503; message: string } {
  const env = getEnv();
  if (env.paymentsOpen) return { ok: true };
  if (env.isProduction || env.paymentProvider !== "mock") {
    return {
      ok: false,
      status: 503,
      message: "Pre-order payments open soon",
    };
  }
  // Local/dev mock path for UX testing only — never in production.
  return { ok: true };
}
