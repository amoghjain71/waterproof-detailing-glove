import type { Metadata } from "next";
import { SizingPageContent } from "@/components/sizing/SizingPageContent";

export const metadata: Metadata = {
  title: "Sizing",
  description:
    "Measure hand circumference and find your Waterproof Detailing Inner Glove size. M measured; L and XL graded; S pending.",
};

export default function SizingPage() {
  return <SizingPageContent />;
}
