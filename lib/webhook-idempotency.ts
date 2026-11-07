import "server-only";

/**
 * Best-effort in-process dedupe for Stripe webhook retries.
 * Durable guard is session.metadata.fulfilled on the Stripe session itself.
 * Wire a hosted store (e.g. Redis) before high volume.
 */

const seen = new Map<string, number>();
const TTL_MS = 1000 * 60 * 60 * 24;

export function claimWebhookEvent(eventId: string): boolean {
  const now = Date.now();
  for (const [id, at] of seen) {
    if (now - at > TTL_MS) seen.delete(id);
  }
  if (seen.has(eventId)) return false;
  seen.set(eventId, now);
  return true;
}
