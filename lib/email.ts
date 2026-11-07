/**
 * Transactional email via Resend.
 * Never log recipient addresses or message bodies.
 */
import "server-only";

import { Resend } from "resend";
import {
  EXCHANGE_POLICY_TEXT,
  PREORDER_CHARGE_TIMING,
  REFUND_PROMISE_SHORT,
  SHIP_ESTIMATE_TEXT,
  SHIP_WINDOW,
} from "@/lib/config";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function orderEmailHtml(input: {
  name: string;
  orderId?: string;
  lines: { label: string; size: string; qty: number }[];
}) {
  const greeting = input.name.trim()
    ? `Hi ${escapeHtml(input.name.trim())},`
    : "Hi,";
  const items = input.lines
    .map(
      (line) =>
        `<li>${escapeHtml(line.label)}, size ${escapeHtml(line.size)}, qty ${line.qty}</li>`,
    )
    .join("");
  const reference = input.orderId
    ? `<p>Reference: ${escapeHtml(input.orderId)}</p>`
    : "";
  return `<p>${greeting}</p>
<p>We have your 2HANDS pre-order.</p>
${reference}
<ul>${items || "<li>Your selected pairs</li>"}</ul>
<p>${escapeHtml(SHIP_WINDOW.trim() || SHIP_ESTIMATE_TEXT)}</p>
<p>${escapeHtml(REFUND_PROMISE_SHORT)}</p>
<p>${escapeHtml(EXCHANGE_POLICY_TEXT)}</p>
<p>${escapeHtml(PREORDER_CHARGE_TIMING)}</p>
<p>Thanks,<br/>2HANDS</p>`;
}

let client: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ ok: boolean; stub?: true }> {
  const resend = getResend();
  if (!resend) {
    console.info("[sendEmail] skipped — RESEND_API_KEY not set", {
      subject: input.subject,
      htmlLength: input.html.length,
    });
    return { ok: false, stub: true };
  }

  // Free Resend: use onboarding@resend.dev (sends only to your Resend account email)
  // After you verify 2handswa.com on the free plan, set EMAIL_FROM to orders@2handswa.com
  const from =
    input.from ||
    process.env.EMAIL_FROM ||
    "2HANDS <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.error("[sendEmail] provider error", error.name);
    return { ok: false };
  }

  console.info("[sendEmail] sent", {
    subject: input.subject,
    htmlLength: input.html.length,
  });
  return { ok: true };
}
