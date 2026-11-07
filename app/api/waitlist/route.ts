import { waitlistSchema } from "@/lib/schemas";
import { appendSubmission } from "@/lib/submissions";
import { savePreorderLead } from "@/lib/leads";
import {
  leadNotifyEmailHtml,
  preorderSignupEmailHtml,
  sendEmail,
  waitlistEmailHtml,
} from "@/lib/email";
import {
  assertAbuseFields,
  clientError,
  gatePublicPost,
  noStoreJson,
  rateLimit,
  readJsonBody,
} from "@/lib/api-guard";

export async function POST(request: Request) {
  const blocked = gatePublicPost(request, "waitlist");
  if (blocked) return blocked;

  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = waitlistSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return clientError(400, "Validation failed");
  }

  if (!assertAbuseFields(parsed.data)) {
    return noStoreJson({ ok: true });
  }

  const data = parsed.data;
  const emailLimit = rateLimit(
    `waitlist-email:${data.email.toLowerCase()}`,
    3,
    60_000,
  );
  if (!emailLimit.ok) {
    return noStoreJson(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(emailLimit.retryAfterSec) },
      },
    );
  }

  const at = new Date().toISOString();
  await appendSubmission({
    type: "waitlist",
    email: data.email,
    phone: data.phone,
    size: data.size,
    source: data.source,
    consent: data.consent,
    at,
  });

  try {
    await savePreorderLead({
      email: data.email,
      phone: data.phone,
      size: data.size,
      source: data.source,
      consent: data.consent,
      at,
    });
  } catch {
    console.error("[waitlist] lead store failed");
  }

  const customerMail = data.phone
    ? preorderSignupEmailHtml()
    : waitlistEmailHtml();
  const customerSend = await sendEmail({
    to: data.email,
    subject: customerMail.subject,
    html: customerMail.html,
  });

  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  if (notifyTo) {
    const leadMail = leadNotifyEmailHtml({
      email: data.email,
      phone: data.phone,
      size: data.size,
      source: data.source,
    });
    const deliveryNote = customerSend.ok
      ? ""
      : `<p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:#4B5560;">Customer confirmation email did not send. With Resend free sender (onboarding@resend.dev), only your Resend account email can receive mail. Verify a domain and set EMAIL_FROM to that domain.</p>`;
    await sendEmail({
      to: notifyTo,
      subject: customerSend.ok
        ? leadMail.subject
        : `${leadMail.subject} (customer email failed)`,
      html: `${leadMail.html}${deliveryNote}`,
    });
  }

  return noStoreJson({ ok: true });
}
