import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Fit, the strap, water at the cuff, sizing, shipping, and pre-order.",
};

export default function FaqPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-h1">Questions</h1>
        <p className="mt-4 text-lead text-ink">
          Fit, the strap, water at the cuff, and what a pre-order means.
        </p>
        <div className="mt-10">
          <Accordion
            items={faqItems.map((item) => ({
              id: item.id,
              title: item.question,
              body: item.answer,
            }))}
            defaultOpen={["fit-under-mitt", "scratch-paint", "stays-on"]}
          />
        </div>
      </div>
    </section>
  );
}
