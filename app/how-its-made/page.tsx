import type { Metadata } from "next";
import { HowItsMadeContent } from "@/components/made/HowItsMadeContent";

export const metadata: Metadata = {
  title: "How It's Made",
  description:
    "Three-layer laminate construction: stretch nylon, closed-cell neoprene, polyester tricot — bonded, sealed, and cuff-engineered.",
};

export default function HowItsMadePage() {
  return <HowItsMadeContent />;
}
