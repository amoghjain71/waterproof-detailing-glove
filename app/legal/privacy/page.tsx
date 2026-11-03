import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        {BRAND.name} collects information you submit for waitlist, contact, and
        checkout purposes — typically name, email, shipping address, size
        preference, and message contents.
      </p>
      <p>
        We use that data to respond to inquiries, fulfill orders, send
        production timing updates you opt into, and improve fit guidance. We do
        not sell personal data.
      </p>
      <p>
        Payment card data will be handled by a PCI-compliant provider when live
        payments are enabled. Until then, mock checkout does not collect card
        numbers on this site.
      </p>
      <p>
        Analytics and server logs may record approximate location, device type,
        and pages visited. You can request access or deletion of
        waitlist/contact records via the contact form.
      </p>
      <p>
        Third-party tools (hosting, email, payments) process data under their
        own policies. This draft will be updated before live fulfillment and
        payment capture.
      </p>
    </LegalPage>
  );
}
