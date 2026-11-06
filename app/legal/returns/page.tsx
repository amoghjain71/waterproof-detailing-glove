import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { EXCHANGE_POLICY_TEXT, REFUND_PROMISE_SHORT } from "@/lib/config";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns">
      <p>
        {REFUND_PROMISE_SHORT} {EXCHANGE_POLICY_TEXT}
      </p>
      <p>
        Gloves that show wear, water exposure, or odor may not qualify for a size
        exchange. Fit notes from trials still help.
      </p>
      <p>
        Defective units from manufacturing issues (seam failure, strap
        non-operation, mismatched left/right) will be replaced or refunded after
        review with photos.
      </p>
      <p>
        Pre-order cancellations before shipment are accepted by contacting
        support. If payment processing is live, refunds follow the processor’s
        settlement timeline.
      </p>
      <p>
        Final return windows, restocking rules, and prepaid label availability
        will be confirmed before live sales. This page remains draft until then.
      </p>
    </LegalPage>
  );
}
