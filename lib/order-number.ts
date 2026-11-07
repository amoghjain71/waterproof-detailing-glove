/**
 * Short customer-facing order number from a Stripe session or mock id.
 * Full session ids stay in Stripe / admin; customers see 2H-XXXXXXXX.
 */
export function formatOrderNumber(orderId: string): string {
  const bare = orderId
    .replace(/^cs_test_/, "")
    .replace(/^cs_live_/, "")
    .replace(/^mock_/, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  const short = (bare.slice(-8) || bare || "ORDER").toUpperCase();
  return `2H-${short}`;
}
