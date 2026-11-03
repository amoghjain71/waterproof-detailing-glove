import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { SALES_MODE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    SALES_MODE === "preorder"
      ? "Pre-order checkout with mock payment — no card fields."
      : "Checkout with mock payment — no card fields.",
};

export default function CheckoutPage() {
  return (
    <div>
      <PageHero
        title="Checkout"
        description="Contact, shipping, and a clearly separated payment slot. Mock orders work in development; Stripe is scaffolded for later."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <CheckoutForm />
      </section>
    </div>
  );
}
