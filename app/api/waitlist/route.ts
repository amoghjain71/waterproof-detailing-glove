import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/schemas";
import { appendSubmission } from "@/lib/submissions";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  console.info("[api/waitlist]", data);

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
    html: `<p>Thanks for joining the waitlist${data.size ? ` for size ${data.size}` : ""}.</p>`,
  });

  return NextResponse.json({ ok: true });
}
