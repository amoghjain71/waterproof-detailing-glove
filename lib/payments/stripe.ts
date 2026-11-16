/**
 * Stripe Checkout Session provider (hosted Checkout).
 * Prices come from lib/config — never from the client body.
 */
import "server-only";

import { BRAND } from "@/lib/config";
import { orderTotal } from "@/lib/commerce";
import { unitPriceUsdForSku } from "@/lib/commerce-price";
import { labelForSku } from "@/lib/catalog";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import type { PaymentProvider } from "@/lib/payments/types";
import type { CheckoutCartItem } from "@/lib/schemas";

function cartSummary(cart: CheckoutCartItem[]): string {
  return cart
    .map((item) => `${item.sku}:${item.size}:${item.qty}`)
    .join("|")
    .slice(0, 450);
}

export const stripePaymentProvider: PaymentProvider = {
  async createCheckout(cart, customer) {
    const stripe = getStripe();
    const { siteUrl } = getEnv();
    const priced = cart.map((item) => ({
      ...item,
      price: unitPriceUsdForSku(item.sku),
      label: labelForSku(item.sku),
    }));
    const subtotal = priced.reduce((sum, item) => sum + item.price * item.qty, 0);
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
    }[] = priced.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: `${item.label}, size ${item.size}`,
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
      ui_mode: "hosted_page",
      mode: "payment",
      customer_email: customer.email,
      client_reference_id: customer.email.slice(0, 200),
      line_items,
      success_url: `${siteUrl}/order/confirmation?orderId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
      submit_type: "pay",
      shipping_address_collection: {
        allowed_countries: ["CA", "MX", "US"],
      },
      name_collection: {
        individual: { enabled: true, optional: true },
      },
      origin_context: "web",
      integration_identifier: "hosted_web_0012",
      metadata: {
        name: customer.name.slice(0, 200),
        phone: (customer.phone ?? "").slice(0, 40),
        cart: cartSummary(cart),
        fulfilled: "0",
      },
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
    // Display-only helper. Never use this path to mark fulfilment complete.
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(orderId);
    return {
      ok: session.payment_status === "paid",
      orderId,
    };
  },
};
