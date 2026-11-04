"use client";

import { PAYMENT_PROVIDER } from "@/lib/config";

export function PaymentSlot({
  onPlaceOrder,
  busy,
  disabled,
}: {
  onPlaceOrder: () => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  const isStripe = PAYMENT_PROVIDER === "stripe";

  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-cyan">Payment</p>
      <p className="mt-2 text-sm font-medium">
        {isStripe ? "Pay securely with Stripe Checkout" : "Payment method coming soon"}
      </p>
      <p className="mt-1 text-xs text-muted">
        {isStripe
          ? "You’ll finish card payment on Stripe’s hosted checkout — no card data touches this site."
          : <>Provider: <code className="text-cyan">{PAYMENT_PROVIDER}</code>. Mock checkout is enabled for local demos.</>}
      </p>

      <button
        type="button"
        disabled={disabled || busy}
        onClick={onPlaceOrder}
        className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {busy
          ? isStripe
            ? "Redirecting to Stripe…"
            : "Placing mock order…"
          : isStripe
            ? "Continue to Stripe Checkout"
            : "Place mock order"}
      </button>
    </div>
  );
}
