import { contactSchema } from "@/lib/schemas";
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
  const blocked = gatePublicPost(request, "contact");
  if (blocked) return blocked;

  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = contactSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return clientError(400, "Validation failed");
  }

  if (!assertAbuseFields(parsed.data)) {
    return noStoreJson({ ok: true });
  }

  const data = parsed.data;
  const emailLimit = rateLimit(
    `contact-email:${data.email.toLowerCase()}`,
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
    type: "contact",
    name: data.name,
    email: data.email,
    topic: data.topic,
    message: data.message,
    at: new Date().toISOString(),
  });

  await sendEmail({
    to: data.email,
    subject: "We got your message — 2Hands",
    html: "<p>Thanks for writing. We will reply soon.</p>",
  });

  return noStoreJson({ ok: true });
}
