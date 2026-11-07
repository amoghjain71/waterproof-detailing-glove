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
  const paymentsOpen = process.env.NEXT_PUBLIC_PAYMENTS_OPEN === "true";
  const isStripeLive = PAYMENT_PROVIDER === "stripe" && paymentsOpen;
  const allowDevMock =
    process.env.NODE_ENV === "development" && PAYMENT_PROVIDER !== "stripe";

  return (
    <div className="border border-rule p-4">
      <p className="text-label text-ink">Payment</p>
      {isStripeLive ? (
        <>
          <p className="mt-2 text-body text-ink">
            Pay securely with Stripe Checkout
          </p>
          <p className="mt-2 text-label text-ink-muted">
            You finish card payment on Stripe. No card data touches this site.
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
        </>
      ) : allowDevMock ? (
        <>
          <p className="mt-2 text-body text-ink">Local mock checkout</p>
          <p className="mt-2 text-label text-ink-muted">
            Development only. No card fields. Production never places mock
            orders.
          </p>
          <Button
            type="button"
            className="mt-4 w-full"
            disabled={disabled}
            loading={busy}
            error={error}
            onClick={onPlaceOrder}
          >
            Place mock order
          </Button>
        </>
      ) : (
        <>
          <p className="mt-2 text-body text-ink">Pre-order payments open soon</p>
          <p className="mt-2 text-label text-ink-muted">
            Card checkout is not open yet. Join the waitlist from the home page
            for timing updates.
          </p>
        </>
      )}
    </div>
  );
}
