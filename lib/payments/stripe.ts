/**
 * Stripe Checkout Session provider — scaffold only.
 *
 * Env vars to set when enabling:
 * - STRIPE_SECRET_KEY
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * - STRIPE_WEBHOOK_SECRET
 *
 * Selected via PAYMENT_PROVIDER=stripe in lib/config.ts / env.
 */

import type { PaymentProvider } from "@/lib/payments/types";

export const stripePaymentProvider: PaymentProvider = {
  async createCheckout() {
    /*
    import Stripe from "stripe";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia",
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: _customer.email,
      line_items: _cart.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: `Waterproof Detailing Inner Glove — Size ${item.size}`,
            metadata: { sku: item.sku, size: item.size },
          },
        },
      })),
      success_url: `${origin}/order/confirmation?orderId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: {
        name: _customer.name,
      },
    });

    return {
      orderId: session.id,
      redirectUrl: session.url ?? undefined,
      clientSecret: session.client_secret ?? undefined,
    };
    */

    throw new Error(
      "Stripe provider is scaffolded but not enabled. Set PAYMENT_PROVIDER=mock or implement stripe.ts.",
    );
  },

  async confirmOrder(orderId) {
    /*
    import Stripe from "stripe";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(orderId);
    return { ok: session.payment_status === "paid", orderId };
    */
    return { ok: false, orderId };
  },
};
