import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import {
  FREE_SHIPPING_OVER_USD,
  REFUND_PROMISE_SHORT,
  SHIPPING_FLAT_USD,
  SHIP_ESTIMATE_TEXT,
  SHIP_WINDOW,
} from "@/lib/config";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  const shipLine = SHIP_WINDOW.trim() || SHIP_ESTIMATE_TEXT;
  return (
    <LegalPage title="Shipping">
      <p>
        {shipLine} {REFUND_PROMISE_SHORT}
      </p>
      <p>
        Flat shipping is {formatUsd(SHIPPING_FLAT_USD)} per order. Orders over{" "}
        {formatUsd(FREE_SHIPPING_OVER_USD)} ship free.
      </p>
      <p>
        We currently plan domestic US shipping first. International options,
        duties, and carriers will be announced separately before overseas
        fulfillment.
      </p>
      <p>
        Tracking links are emailed when a shipment leaves the warehouse. If a
        package is marked delivered but missing, contact us within 7 days so we
        can open a carrier claim.
      </p>
      <p>
        Address changes after an order is packed may not be possible. Incorrect
        addresses provided at checkout can delay or prevent delivery; re-ship
        fees may apply.
      </p>
    </LegalPage>
  );
}
