import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { EXCHANGE_POLICY_TEXT, FREE_SHIPPING_OVER_USD, PREORDER_CHARGE_TIMING, REFUND_PROMISE_SHORT, SHIP_WINDOW } from "@/lib/config";
import { formatUsd } from "@/lib/utils";

const ITEMS = [
  {
    id: "fit",
    title: "Will it fit under a wash mitt?",
    body: "It is a thin five-finger glove. The target is a finished laminate of 1.8 mm or thinner, so a normal mitt can still slide on.",
  },
  {
    id: "paint",
    title: "Will the strap touch the paint?",
    body: "The 25 mm strap is meant to sit under the mitt cuff, away from the paint. There is no exposed metal.",
  },
  {
    id: "cuff",
    title: "What keeps water out at the cuff?",
    body: "A soft silicone lip and a 25 mm strap close the cuff. That is designed to block the path water takes in. The worn-cuff test is still planned.",
  },
  {
    id: "cold",
    title: "Will my hands stay warm?",
    body: "The neoprene is there to keep bucket water off your skin. We are not claiming a thermal rating. Cold-water comfort is still untested.",
  },
  {
    id: "chemicals",
    title: "Can I use it with detailing chemicals?",
    body: "Not as a claim. Chemical testing is planned. Until those results exist, do not treat the glove as chemical protection.",
  },
  {
    id: "care",
    title: "How do I care for it?",
    body: "Draft care: rinse with cool water, then air-dry inside and out. Do not wring, iron, or tumble dry. Care cycles are not validated yet.",
  },
  {
    id: "wrong-size",
    title: "What if I pick the wrong size?",
    body: EXCHANGE_POLICY_TEXT,
  },
  {
    id: "shipping",
    title: "When does it ship?",
    body: `${SHIP_WINDOW}. Free shipping over ${formatUsd(FREE_SHIPPING_OVER_USD)}.`,
  },
  {
    id: "returns",
    title: "Can I get a refund?",
    body: REFUND_PROMISE_SHORT,
  },
  {
    id: "preorder",
    title: "What happens when I pre-order?",
    body: `${PREORDER_CHARGE_TIMING} ${SHIP_WINDOW}.`,
  },
];

export function HomeFaqSection() {
  return (
    <section id="faq" className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-h2">Questions</h2>
        <div className="mt-8">
          <Accordion items={ITEMS} defaultOpen={["fit", "paint", "cuff"]} />
        </div>
        <Link href="/faq" className="mt-6 inline-flex text-label text-brand">
          More questions
        </Link>
      </div>
    </section>
  );
}
