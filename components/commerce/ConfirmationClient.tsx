"use client";

import { useEffect } from "react";
import { PreorderTerms } from "@/components/commerce/OfferNotes";
import { Button } from "@/components/ui/Button";
import { formatOrderNumber } from "@/lib/order-number";
import { useCart } from "@/lib/store/cart";

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const clear = useCart((s) => s.clear);
  const hasRef = Boolean(orderId) && orderId !== "pending";
  const orderNumber = hasRef ? formatOrderNumber(orderId) : null;

  useEffect(() => {
    // Clear local cart after Stripe redirect. This page never marks an order paid.
    if (orderId.startsWith("cs_") || orderId.startsWith("mock_")) clear();
  }, [clear, orderId]);

  return (
    <section className="flex min-h-fold items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <h1 className="font-display text-h1">Thanks</h1>
        {orderNumber ? (
          <div className="mt-4 w-full">
            <p className="text-label text-ink-muted">Order number</p>
            <p className="mt-1 text-body text-ink tabular-nums tracking-wide">
              {orderNumber}
            </p>
          </div>
        ) : null}
        <p className="mt-4 max-w-md text-body text-ink">
          We have your pre-order. A confirmation email goes to the address you
          used at checkout once Stripe confirms payment.
        </p>
        <div className="mt-8 w-full max-w-md text-center">
          <PreorderTerms />
        </div>
        <Button href="/" className="mt-8">
          Back to the glove
        </Button>
      </div>
    </section>
  );
}
