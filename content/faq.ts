import {
  EXCHANGE_POLICY_TEXT,
  FREE_SHIPPING_OVER_USD,
  REFUND_PROMISE_SHORT,
  SHIP_ESTIMATE_TEXT,
} from "@/lib/config";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

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
      "Not as a claim. Chemical testing is planned. Until those results exist, do not treat the glove as chemical protection or PPE.",
  },
  {
    id: "materials-allergens",
    question: "What materials are in the glove? Any allergen or safety concerns?",
    answer:
      "Target build: matte stretch nylon outer, about 1.0 mm closed-cell CR (chloroprene) neoprene foam, smooth polyester tricot inner, a soft silicone cuff lip, and a 25 mm hook-and-loop strap. Materials and adhesives can irritate sensitive skin. This product is not hypoallergenic, not a medical device, and not PPE. If you have a known allergy to neoprene, chloroprene, rubber, silicone, nylon, polyester, or related compounds, do not use it, or ask a clinician first. Stop use and rinse if you get redness, itching, swelling, or rash. Keep away from open flame and high heat. Not for food handling or medical use.",
  },
  {
    id: "children",
    question: "Can kids use it?",
    answer:
      "Not intended for children under 14. Small parts and straps can be a choking or entanglement hazard for younger kids. Adult use only for car-wash and detailing tasks.",
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
      "Measure around the widest knuckles, fingers together, thumb out. Snug, not squeezed. M/L sample range is 200 to 215 mm. Size S is not available. XL is still being set. Between sizes, choose the larger when sizes open.",
  },
  {
    id: "shipping",
    question: "When does it ship?",
    answer: `${SHIP_ESTIMATE_TEXT} Free shipping over $${FREE_SHIPPING_OVER_USD}.`,
  },
  {
    id: "returns",
    question: "Can I get a refund?",
    answer: REFUND_PROMISE_SHORT,
  },
  {
    id: "exchange",
    question: "What if I pick the wrong size?",
    answer: EXCHANGE_POLICY_TEXT,
  },
  {
    id: "preorder",
    question: "What happens when I sign up for pre-orders?",
    answer:
      "You share an email and phone so we can tell you when pre-orders open. Signing up does not charge your card. When checkout opens, payment terms will be shown before you pay.",
  },
];

/** Home accordion: core product + policy + safety. */
export const homeFaqIds = [
  "fit-under-mitt",
  "scratch-paint",
  "stays-on",
  "materials-allergens",
  "children",
  "returns",
  "exchange",
  "shipping",
  "preorder",
] as const;
