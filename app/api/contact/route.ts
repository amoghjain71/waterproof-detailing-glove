import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { appendSubmission } from "@/lib/submissions";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  console.info("[api/contact]", data);

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
    html: `<p>Thanks ${data.name}. We'll reply soon.</p>`,
  });

  return NextResponse.json({ ok: true });
}
