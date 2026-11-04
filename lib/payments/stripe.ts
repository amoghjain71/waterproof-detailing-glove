/**
 * Stripe Checkout Session provider (hosted Checkout).
 *
 * Env:
 * - STRIPE_SECRET_KEY
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * - STRIPE_WEBHOOK_SECRET (fulfillment)
 * - PAYMENT_PROVIDER=stripe
 */

import { BRAND } from "@/lib/config";
import { orderTotal } from "@/lib/commerce";
import { getStripe } from "@/lib/stripe";
import type { PaymentProvider } from "@/lib/payments/types";

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function integrationIdentifier(): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `2hands-checkout-${suffix}`;
}

export const stripePaymentProvider: PaymentProvider = {
  async createCheckout(cart, customer) {
    const stripe = getStripe();
    const origin = siteOrigin();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const { shipping } = orderTotal(subtotal);

    const line_items: {
      quantity: number;
      price_data: {
        currency: "usd";
        unit_amount: number;
        product_data: {
          name: string;
          metadata?: Record<string, string>;
        };
      };
    }[] = cart.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: `${BRAND.productName} — Size ${item.size}`,
          metadata: { sku: item.sku, size: item.size },
        },
      },
    }));

    if (shipping > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(shipping * 100),
          product_data: {
            name: "Shipping",
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items,
      success_url: `${origin}/order/confirmation?orderId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      metadata: {
        name: customer.name,
        phone: customer.phone ?? "",
        ship_line1: customer.address.line1,
        ship_line2: customer.address.line2 ?? "",
        ship_city: customer.address.city,
        ship_state: customer.address.state,
        ship_postal: customer.address.postalCode,
        ship_country: customer.address.country,
      },
      integration_identifier: integrationIdentifier(),
    });

    if (!session.url) {
      throw new Error("Stripe Checkout Session missing redirect URL");
    }

    return {
      orderId: session.id,
      redirectUrl: session.url,
    };
  },

  async confirmOrder(orderId) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(orderId);
    return {
      ok: session.payment_status === "paid",
      orderId,
    };
  },
};
