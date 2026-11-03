import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BRAND, PRICE_USD } from "@/lib/config";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        By using the {BRAND.name} website you agree to these draft terms. If you
        do not agree, do not use the site or place a pre-order.
      </p>
      <p>
        Product descriptions use intent language while Prototype V2 testing is
        in progress. Nothing on this site constitutes certification,
        chemical-resistance claims, thermal ratings, PPE classification, or
        lifetime durability guarantees.
      </p>
      <p>
        Planned retail for the Waterproof Detailing Inner Glove is{" "}
        {formatUsd(PRICE_USD)} per pair (range subject to change). Prices,
        shipping estimates, and availability may change before fulfillment.
      </p>
      <p>
        Pre-order holds (when enabled) are governed by the disclosures shown at
        checkout. Mock checkout creates demonstration orders only and does not
        charge cards.
      </p>
      <p>
        Site content, imagery, video, and trademarks remain property of{" "}
        {BRAND.name} or their respective owners. Do not scrape, republish, or
        misrepresent product claims.
      </p>
      <p>
        These draft terms will be replaced with counsel-reviewed terms before
        live payment capture and shipment.
      </p>
    </LegalPage>
  );
}
