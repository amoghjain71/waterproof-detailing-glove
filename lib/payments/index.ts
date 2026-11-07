import "server-only";

import { getEnv } from "@/lib/env";
import { mockPaymentProvider } from "@/lib/payments/mock";
import { stripePaymentProvider } from "@/lib/payments/stripe";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const { paymentProvider, isProduction, paymentsOpen } = getEnv();
  if (paymentProvider === "stripe" && paymentsOpen) {
    return stripePaymentProvider;
  }
  if (isProduction) {
    throw new Error("Checkout is not open in production");
  }
  return mockPaymentProvider;
}

export type {
  CheckoutCustomer,
  CreateCheckoutResult,
  PaymentProvider,
} from "@/lib/payments/types";
