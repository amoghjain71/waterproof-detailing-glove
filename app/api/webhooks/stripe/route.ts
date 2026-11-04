import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { appendSubmission } from "@/lib/submissions";

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status === "unpaid") return;

  await appendSubmission({
    type: "order",
    orderId: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? "",
    name: session.metadata?.name ?? session.customer_details?.name ?? "",
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    at: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook signature or STRIPE_WEBHOOK_SECRET" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[webhooks/stripe] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn("[webhooks/stripe] async payment failed", session.id);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[webhooks/stripe] handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
