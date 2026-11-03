import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/schemas";
import { getPaymentProvider } from "@/lib/payments";
import { appendSubmission } from "@/lib/submissions";
import { SALES_MODE } from "@/lib/config";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { customer, cart, waitlistEmail } = parsed.data;

  if (SALES_MODE === "preorder" && (waitlistEmail || customer.email)) {
    await appendSubmission({
      type: "waitlist",
      email: waitlistEmail ?? customer.email,
      size: cart[0]?.size,
      source: "checkout-preorder",
      at: new Date().toISOString(),
    });
  }

  try {
    const provider = getPaymentProvider();
    const result = await provider.createCheckout(cart, customer);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
