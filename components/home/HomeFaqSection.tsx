import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems, homeFaqIds } from "@/content/faq";

const ITEMS = homeFaqIds
  .map((id) => faqItems.find((item) => item.id === id))
  .filter((item): item is (typeof faqItems)[number] => Boolean(item))
  .map((item) => ({
    id: item.id,
    title: item.question,
    body: item.answer,
  }));

export function HomeFaqSection() {
  return (
    <section id="faq" className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 data-path-point className="relative z-10 font-display text-h2">
          Questions
        </h2>
        <div className="relative z-10 mt-8">
          <Accordion
            items={ITEMS}
            defaultOpen={["fit-under-mitt", "materials-allergens", "returns"]}
          />
        </div>
        <Link href="/faq" className="relative z-10 mt-6 inline-flex text-label text-brand">
          More questions
        </Link>
      </div>
    </section>
  );
}
