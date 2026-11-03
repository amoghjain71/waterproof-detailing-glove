"use client";

import { PAYMENT_PROVIDER } from "@/lib/config";

export function PaymentSlot({
  onMockPlaceOrder,
  busy,
  disabled,
}: {
  onMockPlaceOrder: () => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-cyan">Payment</p>
      <p className="mt-2 text-sm font-medium">Payment method coming soon</p>
      <p className="mt-1 text-xs text-muted">
        Provider: <code className="text-cyan">{PAYMENT_PROVIDER}</code>. No card
        fields are collected on this site. Stripe Checkout Session scaffold
        lives in <code>lib/payments/stripe.ts</code>.
      </p>

      {process.env.NODE_ENV === "development" || PAYMENT_PROVIDER === "mock" ? (
        <button
          type="button"
          disabled={disabled || busy}
          onClick={onMockPlaceOrder}
          className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Placing mock order…" : "Place mock order"}
        </button>
      ) : null}
    </div>
  );
}
