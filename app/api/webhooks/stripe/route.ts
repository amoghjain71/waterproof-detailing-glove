import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { appendSubmission } from "@/lib/submissions";
import { orderEmailHtml, sendEmail } from "@/lib/email";
import { labelForSku } from "@/lib/catalog";
import { claimWebhookEvent } from "@/lib/webhook-idempotency";
import { clientError, noStoreJson } from "@/lib/api-guard";

function parseCartLines(cartMeta: string | undefined) {
  if (!cartMeta) return [] as { label: string; size: string; qty: number }[];
  return cartMeta
    .split("|")
    .map((part) => {
      const [sku, size, qtyRaw] = part.split(":");
      const qty = Number(qtyRaw);
      if (!sku || !size || !Number.isFinite(qty)) return null;
      return { label: labelForSku(sku), size, qty };
    })
    .filter((row): row is { label: string; size: string; qty: number } =>
      Boolean(row),
    );
}

async function fulfillCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status === "unpaid") return;
  if (session.metadata?.fulfilled === "1") return;

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

  const to =
    session.customer_details?.email ?? session.customer_email ?? undefined;
  if (to) {
    await sendEmail({
      to,
      subject: "We got your 2HANDS pre-order",
      html: orderEmailHtml({
        name: session.metadata?.name ?? "",
        orderId: session.id,
        lines: parseCartLines(session.metadata?.cart),
      }),
    });
  }

  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...(session.metadata ?? {}),
      fulfilled: "1",
    },
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return clientError(400, "Invalid request");
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    console.error("[webhooks/stripe] signature verification failed");
    return clientError(400, "Invalid signature");
  }

  if (!claimWebhookEvent(event.id)) {
    return noStoreJson({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(stripe, session);
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
  } catch {
    console.error("[webhooks/stripe] handler error");
    return clientError(500, "Webhook handler failed");
  }

  return noStoreJson({ received: true });
}
