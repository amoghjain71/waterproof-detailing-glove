"use client";

import { Button } from "@/components/ui/Button";
import { PAYMENT_PROVIDER } from "@/lib/config";

export function PaymentSlot({
  onPlaceOrder,
  busy,
  disabled,
  error = false,
}: {
  onPlaceOrder: () => void;
  busy?: boolean;
  disabled?: boolean;
  error?: boolean;
}) {
  const isStripe = PAYMENT_PROVIDER === "stripe";

  return (
    <div className="border border-rule p-4">
      <p className="text-label text-ink">Payment</p>
      <p className="mt-2 text-body text-ink">
        {isStripe ? "Pay securely with Stripe Checkout" : "Payment method coming soon"}
      </p>
      <p className="mt-2 text-label text-ink-muted">
        {isStripe
          ? "You finish card payment on Stripe. No card data touches this site."
          : "Card payment is not connected on this build. This demo order does not charge a card."}
      </p>
      <Button
        type="button"
        className="mt-4 w-full"
        disabled={disabled}
        loading={busy}
        error={error}
        onClick={onPlaceOrder}
      >
        Pre-order
      </Button>
    </div>
  );
}
