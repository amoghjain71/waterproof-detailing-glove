import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import {
  FREE_SHIPPING_OVER_USD,
  SHIPPING_FLAT_USD,
  SHIP_ESTIMATE_TEXT,
} from "@/lib/config";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping">
      <p>
        Pre-order shipments begin after fit-trial lock and the first production
        run. {SHIP_ESTIMATE_TEXT}
      </p>
      <p>
        Flat shipping is {formatUsd(SHIPPING_FLAT_USD)} per order unless a
        promotion states otherwise. Orders over{" "}
        {formatUsd(FREE_SHIPPING_OVER_USD)} qualify for free shipping once live
        checkout is enabled.
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
