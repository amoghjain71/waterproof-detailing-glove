import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Fit, materials and allergens, sizing, shipping, refunds, exchanges, and pre-order signup.",
};

export default function FaqPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-h1">Questions</h1>
        <p className="mt-4 text-lead text-ink">
          Fit, materials and safety, sizing, shipping, refunds, and what signup
          means.
        </p>
        <div className="mt-10">
          <Accordion
            items={faqItems.map((item) => ({
              id: item.id,
              title: item.question,
              body: item.answer,
            }))}
            defaultOpen={["fit-under-mitt", "materials-allergens", "returns"]}
          />
        </div>
      </div>
    </section>
  );
}
