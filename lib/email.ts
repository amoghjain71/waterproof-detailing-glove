/**
 * sendEmail() stub — wire Resend later.
 * Never log recipient addresses or message bodies.
 */
import "server-only";

import {
  EXCHANGE_POLICY_TEXT,
  PREORDER_CHARGE_TIMING,
  REFUND_PROMISE_SHORT,
  SHIP_WINDOW,
} from "@/lib/config";

export function orderEmailHtml(input: {
  name: string;
  lines: { label: string; size: string; qty: number }[];
}) {
  const items = input.lines
    .map((line) => `<li>${line.label}, size ${line.size}, qty ${line.qty}</li>`)
    .join("");
  return `<p>Hi,</p>
<p>We have your 2HANDS pre-order.</p>
<ul>${items}</ul>
<p>${SHIP_WINDOW}.</p>
<p>${REFUND_PROMISE_SHORT}</p>
<p>${EXCHANGE_POLICY_TEXT}</p>
<p>${PREORDER_CHARGE_TIMING}</p>`;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ ok: boolean; stub: true }> {
  console.info("[sendEmail stub]", {
    subject: input.subject,
    htmlLength: input.html.length,
  });
  return { ok: true, stub: true };
}
