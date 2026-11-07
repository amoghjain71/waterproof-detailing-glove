/**
 * Edit transactional email copy here.
 * Body lines become paragraphs. Use plain text; HTML is applied in lib/email.ts.
 */
import { BRAND } from "@/lib/config";

export const emailCopy = {
  preorderSignup: {
    subject: `You're on the ${BRAND.name} pre-order list`,
    /** Shown when signup includes a phone number. */
    body: [
      "Thanks for signing up.",
      "We saved your email and phone for the drop.",
      "We will email you when pre-orders open, and may text that number then.",
      "Product updates only. No spam.",
    ],
    signOff: `Thanks,\n${BRAND.name}`,
  },
  waitlist: {
    subject: `You're on the ${BRAND.name} waitlist`,
    body: [
      "Thanks for joining the waitlist.",
      "We will email product updates only.",
    ],
    signOff: `Thanks,\n${BRAND.name}`,
  },
  contactAck: {
    subject: `We got your message — ${BRAND.name}`,
    body: ["Thanks for writing. We will reply soon."],
    signOff: `Thanks,\n${BRAND.name}`,
  },
  orderConfirm: {
    subject: `We got your ${BRAND.name} pre-order`,
    headline: "We have your pre-order.",
    intro: "Thanks for ordering. Keep this email for your records.",
    orderNumberLabel: "Order number",
    itemsLabel: "Your order",
    totalLabel: "Total charged",
    emptyCartLine: "Your selected pairs",
    ctaLabel: "Back to the glove",
    signOff: `Thanks,\n${BRAND.name}`,
  },
  leadNotify: {
    subject: `New ${BRAND.name} pre-order signup`,
    intro: "New signup",
  },
} as const;
