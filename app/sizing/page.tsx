import type { Metadata } from "next";
import { SizingPageContent } from "@/components/sizing/SizingPageContent";

export const metadata: Metadata = {
  title: "Sizing",
  description:
    "Measure hand circumference and find your Waterproof Detailing Inner Glove size. Size M confirmed; S, L, XL from fit trials.",
};

export default function SizingPage() {
  return <SizingPageContent />;
}
