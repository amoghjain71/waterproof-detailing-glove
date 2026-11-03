import { NextResponse } from "next/server";

/**
 * Stripe webhook stub.
 *
 * When enabling Stripe:
 * 1. Verify signature with STRIPE_WEBHOOK_SECRET
 * 2. Handle checkout.session.completed
 * 3. Mark order paid / fulfill
 */
export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.info("[webhooks/stripe stub]", {
    hasSignature: Boolean(signature),
    bytes: payload.length,
  });

  /*
  import Stripe from "stripe";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const event = stripe.webhooks.constructEvent(
    payload,
    signature!,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  if (event.type === "checkout.session.completed") {
    // fulfill
  }
  */

  return NextResponse.json({
    received: true,
    stub: true,
    message: "Stripe webhook not implemented — PAYMENT_PROVIDER=mock",
  });
}
