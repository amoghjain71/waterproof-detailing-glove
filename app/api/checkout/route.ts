import { checkoutRequestSchema } from "@/lib/schemas";
import { getPaymentProvider } from "@/lib/payments";
import { appendSubmission } from "@/lib/submissions";
import { SALES_MODE } from "@/lib/config";
import { assertCheckoutAvailable } from "@/lib/env";
import {
  assertAbuseFields,
  clientError,
  gatePublicPost,
  noStoreJson,
  readJsonBody,
} from "@/lib/api-guard";

export async function POST(request: Request) {
  const blocked = gatePublicPost(request, "checkout");
  if (blocked) return blocked;

  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = checkoutRequestSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return clientError(400, "Validation failed");
  }

  if (!assertAbuseFields(parsed.data)) {
    // Soft-fail bots without tipping them; client treats missing redirect as failure.
    return noStoreJson({ ok: true });
  }

  const availability = assertCheckoutAvailable();
  if (!availability.ok) {
    return clientError(availability.status, availability.message);
  }

  const { customer, cart, waitlistEmail, attribution } = parsed.data;

  if (SALES_MODE === "preorder" && (waitlistEmail || customer.email)) {
    await appendSubmission({
      type: "waitlist",
      email: waitlistEmail ?? customer.email,
      size: cart[0]?.size,
      source: attribution?.src
        ? `checkout-preorder:${attribution.src}`
        : attribution?.utm_source
          ? `checkout-preorder:${attribution.utm_source}`
          : "checkout-preorder",
      at: new Date().toISOString(),
    });
  }

  try {
    const provider = getPaymentProvider();
    const result = await provider.createCheckout(cart, customer);
    // Confirmation email is webhook-only after payment verification.
    return noStoreJson(result);
  } catch (err) {
    console.error("[api/checkout]", err instanceof Error ? err.name : "error");
    return clientError(500, "Checkout failed");
  }
}
