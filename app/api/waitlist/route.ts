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
    size: data.size,
    source: data.source,
    at: new Date().toISOString(),
  });

  await sendEmail({
    to: data.email,
    subject: "You're on the 2Hands waitlist",
    html: "<p>Thanks for joining the waitlist. We will email product updates only.</p>",
  });

  return noStoreJson({ ok: true });
}
