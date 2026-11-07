"use client";

import { useEffect } from "react";
import { PreorderTerms } from "@/components/commerce/OfferNotes";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart";

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const clear = useCart((s) => s.clear);
  const hasRef = Boolean(orderId) && orderId !== "pending";

  useEffect(() => {
    // Clear local cart after Stripe redirect. This page never marks an order paid.
    if (orderId.startsWith("cs_") || orderId.startsWith("mock_")) clear();
  }, [clear, orderId]);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-h1">Thanks</h1>
        {hasRef ? (
          <p className="mt-4 text-lead text-ink">Reference {orderId}</p>
        ) : null}
        <p className="mt-4 text-body text-ink">
          If you completed Stripe Checkout, Stripe holds the payment status. This
          page does not confirm payment. A receipt email is sent only after the
          payment webhook succeeds.
        </p>
        <div className="mt-8">
          <PreorderTerms />
        </div>
        <Button href="/glove" className="mt-8">
          Back to the glove
        </Button>
      </div>
    </section>
  );
}
