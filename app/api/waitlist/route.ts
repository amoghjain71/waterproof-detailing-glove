import { waitlistSchema } from "@/lib/schemas";
import { appendSubmission } from "@/lib/submissions";
import { sendEmail } from "@/lib/email";
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

  await appendSubmission({
    type: "waitlist",
    email: data.email,
    phone: data.phone,
    size: data.size,
    source: data.source,
    consent: data.consent,
    at: new Date().toISOString(),
  });

  await sendEmail({
    to: data.email,
    subject: "You're on the 2HANDS pre-order list",
    html: data.phone
      ? "<p>Thanks for signing up. We will email and text when pre-orders open. Product updates only.</p>"
      : "<p>Thanks for joining the waitlist. We will email product updates only.</p>",
  });

  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  if (notifyTo) {
    const safeEmail = data.email
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    const safePhone = (data.phone ?? "not provided")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    const safeSize = (data.size ?? "n/a")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    const safeSource = (data.source ?? "waitlist")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    await sendEmail({
      to: notifyTo,
      subject: "New 2HANDS pre-order signup",
      html: `<p>New signup</p><ul><li>Email: ${safeEmail}</li><li>Phone: ${safePhone}</li><li>Size: ${safeSize}</li><li>Source: ${safeSource}</li></ul>`,
    });
  }

  return noStoreJson({ ok: true });
}
