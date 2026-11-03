/**
 * sendEmail() stub — wire Resend later.
 *
 * Suggested:
 *   import { Resend } from "resend";
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({ from, to, subject, html });
 */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ ok: boolean; stub: true }> {
  // TODO: Resend integration
  console.info("[sendEmail stub]", {
    to: input.to,
    subject: input.subject,
    from: input.from ?? "noreply@2hands.local",
    htmlLength: input.html.length,
  });
  return { ok: true, stub: true };
}
