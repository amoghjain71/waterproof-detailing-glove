import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest pre-order checkout. Shipping and the refund terms are on this page.",
};

export default function CheckoutPage() {
  return (
    <div>
      <PageHero
        title="Checkout"
        description="Name, email, and a shipping address. No account."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <CheckoutForm />
      </section>
    </div>
  );
}
