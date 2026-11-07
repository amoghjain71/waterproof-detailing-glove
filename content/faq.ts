import {
  EXCHANGE_POLICY_TEXT,
  FREE_SHIPPING_OVER_USD,
  PREORDER_CHARGE_TIMING,
  REFUND_PROMISE_SHORT,
  SHIP_WINDOW,
} from "@/lib/config";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const shipping = `Free shipping over $${FREE_SHIPPING_OVER_USD}.`;

export const faqItems: FaqItem[] = [
  {
    id: "fit-under-mitt",
    question: "Will it fit under a wash mitt?",
    answer:
      "It is a thin five-finger glove. The target is a finished laminate of 1.8 mm or thinner, so a normal mitt can still slide on.",
  },
  {
    id: "scratch-paint",
    question: "Will the strap touch the paint?",
    answer:
      "The 25 mm strap is meant to sit under the mitt cuff. There is no exposed metal.",
  },
  {
    id: "stays-on",
    question: "What keeps water out at the cuff?",
    answer:
      "A soft silicone lip and a 25 mm strap close the cuff. That is designed to block the path water takes in. The worn-cuff test is still planned.",
  },
  {
    id: "cold-water",
    question: "Will my hands stay warm?",
    answer:
      "The neoprene is there to keep bucket water off your skin. We are not claiming a temperature rating.",
  },
  {
    id: "chemicals",
    question: "Can I use it with detailing chemicals?",
    answer:
      "Not as a claim. Chemical testing is planned. Until those results exist, do not treat the glove as chemical protection.",
  },
  {
    id: "care",
    question: "How do I care for it?",
    answer:
      "Draft until care tests pass: rinse with cool water, then air-dry inside and out. Do not wring, iron, or tumble dry.",
  },
  {
    id: "sizing",
    question: "How do I pick a size?",
    answer:
      "Measure around the widest knuckles, fingers together, thumb out. Snug, not squeezed. M is 200 to 215 mm. Size S is not available. L and XL are still being set. Between sizes, choose the larger.",
  },
  {
    id: "shipping",
    question: "When does it ship?",
    answer: `${SHIP_WINDOW}. ${shipping}`,
  },
  {
    id: "returns",
    question: "Can I get a refund?",
    answer: `${REFUND_PROMISE_SHORT} ${EXCHANGE_POLICY_TEXT}`,
  },
  {
    id: "preorder",
    question: "What happens when I pre-order?",
    answer: `${PREORDER_CHARGE_TIMING} ${SHIP_WINDOW}.`,
  },
];
