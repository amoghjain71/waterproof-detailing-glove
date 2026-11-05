export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "fit-under-mitt",
    question: "Does it fit under a normal wash mitt?",
    answer:
      "It is built as a thin five-finger inner glove with minimal seam bulk, designed to sit underneath a standard microfiber, chenille, or merino wash mitt. Size M sample dimensions target that under-mitt fit; L and XL are graded from that sample.",
  },
  {
    id: "stays-on",
    question: "How does it stay on while I wash?",
    answer:
      "A 60 mm cuff with a soft silicone sealing lip on the inside and an adjustable 25 mm low-profile hook-and-loop strap is engineered to sit snug at the wrist — under the mitt — so the closure does not sit on paint.",
  },
  {
    id: "scratch-paint",
    question: "Will the strap scratch paint?",
    answer:
      "There is no exposed metal or abrasive hardware. The strap is low-profile and designed to live under the wash mitt so it cannot contact paint during normal use.",
  },
  {
    id: "cold-water",
    question: "Will it help with cold water?",
    answer:
      "The closed-cell neoprene core (target 1.0 mm) is designed to help keep water off your skin so hands stay more comfortable in cool washes. We are not claiming a thermal rating; cold-water comfort testing is planned separately from waterproof validation.",
  },
  {
    id: "chemicals",
    question: "What about detailing chemicals?",
    answer:
      "We are not claiming chemical resistance yet. Chemical compatibility testing (V06) is planned against real detailing products once the exposure list is locked. Until then we use intent language only.",
  },
  {
    id: "care",
    question: "How do I care for the gloves?",
    answer:
      "Draft care until validated: rinse with clean cool water after use, air-dry fully inside and outside away from direct heat, and do not wring, iron, or tumble dry.",
  },
  {
    id: "sizing",
    question: "How do I pick a size?",
    answer:
      "Measure bare-hand circumference around the widest knuckles (fingers together, thumb excluded) with a flexible tape — not squeezed. M is 200–215 mm (measured sample). L is 216–230 mm and XL is 231–250 mm, graded from M using standard work-glove size steps. S is still pending. Between sizes, choose the larger.",
  },
  {
    id: "shipping",
    question: "When will orders ship?",
    answer:
      "We are in pre-order. Shipping timing follows fit-trial lock and the first production run. Flat shipping and free-shipping thresholds are listed at checkout; estimate details are shared by email.",
  },
  {
    id: "returns",
    question: "What is the return policy?",
    answer:
      "Draft returns policy is published under Legal. Final terms will be confirmed before live fulfillment. Unopened, unused pairs in original condition are the baseline for returns once shipping begins.",
  },
  {
    id: "why-glove",
    question: "Why a glove instead of a lined mitt?",
    answer:
      "Pros told us they swap 2–4 mitts per wash. A lined mitt cannot stay dry inside when it goes back in the bucket. A glove worn once under any mitt matches how people actually wash.",
  },
  {
    id: "tested",
    question: "Is it tested / waterproof certified?",
    answer:
      "Prototype V2. Waterproof and durability gates (body leakage, worn-cuff, flex, closure, care, chemistry, mitt compatibility) are planned or in progress. We do not claim certification, and we will show every result — passed or not — on the Tested page.",
  },
  {
    id: "preorder",
    question: "What does pre-order mean?",
    answer:
      "You reserve a pair at the planned retail price before full production. We capture your size preference and email, then confirm timing as fit data and factory samples lock. Payment processing will be enabled before live charges.",
  },
];
