import { PAYMENT_PROVIDER } from "@/lib/config";
import { mockPaymentProvider } from "@/lib/payments/mock";
import { stripePaymentProvider } from "@/lib/payments/stripe";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  if (PAYMENT_PROVIDER === "stripe") {
    return stripePaymentProvider;
  }
  return mockPaymentProvider;
}

export type { CheckoutCustomer, CreateCheckoutResult, PaymentProvider } from "@/lib/payments/types";
