"use client";

import { useEffect } from "react";
import { PreorderTerms } from "@/components/commerce/OfferNotes";
import { Button } from "@/components/ui/Button";
import { PAYMENT_PROVIDER } from "@/lib/config";
import { useCart } from "@/lib/store/cart";

export function ConfirmationClient({ orderId }: { orderId: string }) {
  const isStripe = PAYMENT_PROVIDER === "stripe" || orderId.startsWith("cs_");
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    if (isStripe) clear();
  }, [clear, isStripe]);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-h1">Pre-order received</h1>
        <p className="mt-4 text-lead text-ink">Reference {orderId}</p>
        <p className="mt-4 text-body text-ink">
          {isStripe
            ? "Stripe has the payment. A receipt goes to the email you used."
            : "This demo order did not charge a card."}
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
