import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns">
      <p>
        Once fulfillment begins, unused pairs in original condition may be
        returned within 30 days of delivery unless otherwise stated at checkout.
      </p>
      <p>
        Tried-on gloves that show wear, water exposure, chemical residue, or odor
        may not qualify. We still want fit feedback — size notes from fit trials
        help lock S / L / XL ranges.
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
