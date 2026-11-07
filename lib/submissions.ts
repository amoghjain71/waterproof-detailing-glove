import "server-only";

/**
 * Personal data must not be written into the project tree.
 * Phase 2: record metadata only (no email/name/message bodies in logs).
 * Wire Resend / a hosted store in Phase 3+ for real retention.
 */

export type Submission =
  | {
      type: "waitlist";
      email: string;
      phone?: string;
      size?: string;
      source?: string;
      consent?: boolean;
      at: string;
    }
  | {
      type: "contact";
      name: string;
      email: string;
      topic?: string;
      message: string;
      at: string;
    }
  | {
      type: "order";
      orderId: string;
      email: string;
      name: string;
      paymentStatus: string;
      amountTotal: number | null;
      currency: string | null;
      at: string;
    };

export async function appendSubmission(entry: Submission): Promise<void> {
  console.info("[submission]", {
    type: entry.type,
    at: entry.at,
    size: entry.type === "waitlist" ? entry.size : undefined,
    source: entry.type === "waitlist" ? entry.source : undefined,
    topic: entry.type === "contact" ? entry.topic : undefined,
    orderId: entry.type === "order" ? entry.orderId : undefined,
    paymentStatus: entry.type === "order" ? entry.paymentStatus : undefined,
  });
}
