/**
 * Transactional email via Resend.
 * Edit message copy in content/emails.ts — layout and send live here.
 * Never log recipient addresses or message bodies.
 */
import "server-only";

import { Resend } from "resend";
import { emailCopy } from "@/content/emails";
import {
  BRAND,
  EXCHANGE_POLICY_TEXT,
  PREORDER_CHARGE_TIMING,
  REFUND_PROMISE_SHORT,
  SHIP_ESTIMATE_TEXT,
  SHIP_WINDOW,
} from "@/lib/config";
import { formatOrderNumber } from "@/lib/order-number";
import { SITE } from "@/lib/site";
import { formatUsd } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Absolute origin for images in email. Never localhost — Gmail cannot fetch it.
 * Prefer EMAIL_ASSET_BASE_URL, then production Vercel URL, then SITE.url.
 */
function emailAssetBaseUrl() {
  const explicit = process.env.EMAIL_ASSET_BASE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    "",
  );
  if (vercelProd) {
    return vercelProd.startsWith("http")
      ? vercelProd
      : `https://${vercelProd}`;
  }

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) {
    return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  }

  const site = SITE.url.replace(/\/$/, "");
  if (
    site &&
    !site.includes("localhost") &&
    !site.includes("127.0.0.1") &&
    !site.endsWith(".local")
  ) {
    return site;
  }

  return "https://waterproof-detailing-glove.vercel.app";
}

function paragraphs(lines: readonly string[]) {
  return lines
    .map(
      (line) =>
        `<p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#0F1216;">${escapeHtml(line)}</p>`,
    )
    .join("");
}

function signOffHtml(signOff: string) {
  return `<p style="margin:24px 0 0;font-size:16px;line-height:1.5;color:#0F1216;">${escapeHtml(signOff).replaceAll("\n", "<br/>")}</p>`;
}

/** Shared branded shell — logo must be an absolute public URL. */
export function wrapEmailHtml(bodyHtml: string) {
  const base = emailAssetBaseUrl();
  const logoUrl = `${base}/images/brand/logo-mark.png`;
  const siteUrl = base;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#E8EBED;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E8EBED;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F6F7F8;border:1px solid #C5CCD2;border-radius:4px;">
          <tr>
            <td style="padding:24px 24px 16px;border-bottom:1px solid #C5CCD2;">
              <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;color:#0F1216;">
                <img src="${logoUrl}" alt="${escapeHtml(BRAND.name)}" width="72" height="68" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:72px;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 32px;font-family:Arial,Helvetica,sans-serif;color:#0F1216;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:#4B5560;">
          ${escapeHtml(BRAND.name)} · ${escapeHtml(BRAND.tagline)}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function preorderSignupEmailHtml() {
  const copy = emailCopy.preorderSignup;
  return {
    subject: copy.subject,
    html: wrapEmailHtml(`${paragraphs(copy.body)}${signOffHtml(copy.signOff)}`),
  };
}

export function waitlistEmailHtml() {
  const copy = emailCopy.waitlist;
  return {
    subject: copy.subject,
    html: wrapEmailHtml(`${paragraphs(copy.body)}${signOffHtml(copy.signOff)}`),
  };
}

export function contactAckEmailHtml() {
  const copy = emailCopy.contactAck;
  return {
    subject: copy.subject,
    html: wrapEmailHtml(`${paragraphs(copy.body)}${signOffHtml(copy.signOff)}`),
  };
}

export function leadNotifyEmailHtml(input: {
  email: string;
  phone?: string;
  size?: string;
  source?: string;
}) {
  const copy = emailCopy.leadNotify;
  const rows = [
    ["Email", input.email],
    ["Phone", input.phone ?? "not provided"],
    ["Size", input.size ?? "n/a"],
    ["Source", input.source ?? "waitlist"],
  ]
    .map(
      ([label, value]) =>
        `<li style="margin:0 0 6px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`,
    )
    .join("");
  return {
    subject: copy.subject,
    html: wrapEmailHtml(
      `<p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#0F1216;">${escapeHtml(copy.intro)}</p><ul style="margin:0;padding-left:20px;font-size:16px;line-height:1.5;color:#0F1216;">${rows}</ul>`,
    ),
  };
}

function formatMoneyFromCents(
  amountTotal: number | null | undefined,
  currency: string | null | undefined,
) {
  if (amountTotal == null || !Number.isFinite(amountTotal)) return null;
  const code = (currency || "usd").toUpperCase();
  if (code === "USD") return formatUsd(amountTotal / 100);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amountTotal / 100);
  } catch {
    return `${(amountTotal / 100).toFixed(2)} ${code}`;
  }
}

export function orderEmailHtml(input: {
  name: string;
  orderId?: string;
  lines: { label: string; size: string; qty: number }[];
  amountTotal?: number | null;
  currency?: string | null;
}) {
  const copy = emailCopy.orderConfirm;
  const base = emailAssetBaseUrl();
  const greeting = input.name.trim()
    ? `Hi ${escapeHtml(input.name.trim())},`
    : "Hi,";
  const orderNumber = input.orderId
    ? formatOrderNumber(input.orderId)
    : null;
  const total = formatMoneyFromCents(input.amountTotal, input.currency);

  const productImageUrl = `${base}/images/glove/10-packaging.jpg`;
  const productImageCell = `
  <td width="80" valign="top" style="padding:12px 12px 12px 0;border-bottom:1px solid #C5CCD2;">
    <img src="${productImageUrl}" alt="${escapeHtml(BRAND.productName)}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;width:72px;height:72px;object-fit:cover;" />
  </td>`;

  const itemRows =
    input.lines.length > 0
      ? input.lines
          .map(
            (line) => `
<tr>
${productImageCell}
  <td style="padding:12px 0;border-bottom:1px solid #C5CCD2;font-size:16px;line-height:1.5;color:#0F1216;">
    ${escapeHtml(line.label)}
    <br/>
    <span style="font-size:14px;line-height:1.4;color:#4B5560;">Size ${escapeHtml(line.size)}</span>
  </td>
  <td align="right" valign="top" style="padding:12px 0;border-bottom:1px solid #C5CCD2;font-size:16px;line-height:1.5;color:#0F1216;font-variant-numeric:tabular-nums;white-space:nowrap;">
    × ${line.qty}
  </td>
</tr>`,
          )
          .join("")
      : `
<tr>
${productImageCell}
  <td colspan="2" style="padding:12px 0;border-bottom:1px solid #C5CCD2;font-size:16px;line-height:1.5;color:#0F1216;">
    ${escapeHtml(copy.emptyCartLine)}
  </td>
</tr>`;

  const orderNumberBlock = orderNumber
    ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#E8EBED;border:1px solid #C5CCD2;border-radius:4px;">
  <tr>
    <td style="padding:16px;">
      <p style="margin:0 0 4px;font-size:14px;line-height:1.4;color:#4B5560;">${escapeHtml(copy.orderNumberLabel)}</p>
      <p style="margin:0;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0.04em;color:#0F1216;font-variant-numeric:tabular-nums;">${escapeHtml(orderNumber)}</p>
    </td>
  </tr>
</table>`
    : "";

  const totalRow = total
    ? `
<tr>
  <td colspan="2" style="padding:16px 0 0;font-size:16px;line-height:1.5;font-weight:600;color:#0F1216;">${escapeHtml(copy.totalLabel)}</td>
  <td align="right" style="padding:16px 0 0;font-size:16px;line-height:1.5;font-weight:600;color:#0F1216;font-variant-numeric:tabular-nums;">${escapeHtml(total)}</td>
</tr>`
    : "";

  const ship = SHIP_WINDOW.trim() || SHIP_ESTIMATE_TEXT;
  const body = `
<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:700;color:#0F1216;">${escapeHtml(copy.headline)}</h1>
<p style="margin:0 0 8px;font-size:16px;line-height:1.5;color:#0F1216;">${greeting}</p>
<p style="margin:0 0 24px;font-size:16px;line-height:1.5;color:#0F1216;">${escapeHtml(copy.intro)}</p>
${orderNumberBlock}
<p style="margin:0 0 8px;font-size:14px;line-height:1.4;color:#4B5560;">${escapeHtml(copy.itemsLabel)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
${itemRows}
${totalRow}
</table>
<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#4B5560;">${escapeHtml(ship)}</p>
<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#4B5560;">${escapeHtml(REFUND_PROMISE_SHORT)}</p>
<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#4B5560;">${escapeHtml(EXCHANGE_POLICY_TEXT)}</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#4B5560;">${escapeHtml(PREORDER_CHARGE_TIMING)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr>
    <td style="background:#1B5FE0;border-radius:4px;">
      <a href="${escapeHtml(base)}" style="display:inline-block;padding:14px 24px;font-size:16px;line-height:1.25;font-weight:600;color:#FFFFFF;text-decoration:none;">${escapeHtml(copy.ctaLabel)}</a>
    </td>
  </tr>
</table>
${signOffHtml(copy.signOff)}`;
  return wrapEmailHtml(body);
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

  const from =
    input.from ||
    process.env.EMAIL_FROM ||
    `${BRAND.name} <onboarding@resend.dev>`;

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
