import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BRAND, PARTNERSHIP_EMAIL } from "@/lib/config";
import { IP } from "@/lib/ip";

export const metadata: Metadata = { title: "Intellectual property" };

export default function IntellectualPropertyPage() {
  return (
    <LegalPage title="Intellectual property">
      <p>
        {BRAND.name} is a trademark of the owner.
      </p>
      <p>{IP.LONG_NOTICE}</p>
      <p>
        Site photos, videos, and text may not be copied without permission.
      </p>
      <p>
        For licensing or to report a copy, email{" "}
        <a href={`mailto:${PARTNERSHIP_EMAIL}`} className="text-brand">
          {PARTNERSHIP_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
