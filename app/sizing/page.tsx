import type { Metadata } from "next";
import { SizingPageContent } from "@/components/sizing/SizingPageContent";

export const metadata: Metadata = {
  title: "Sizing",
  description:
    "Measure around the widest knuckles. Size M is 200 to 215 mm. Other sizes are still being set.",
};

export default function SizingPage() {
  return <SizingPageContent />;
}
