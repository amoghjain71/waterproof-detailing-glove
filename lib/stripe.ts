import "server-only";

import Stripe from "stripe";

let client: Stripe | null = null;

/** Shared Stripe SDK instance for server routes. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}
