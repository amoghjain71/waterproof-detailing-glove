import type { Metadata } from "next";
import { HowItsMadeContent } from "@/components/made/HowItsMadeContent";

export const metadata: Metadata = {
  title: "How It's Made",
  description:
    "How the 2HANDS glove is cut, bonded, and sealed. Nylon, neoprene, and tricot.",
};

export default function HowItsMadePage() {
  return <HowItsMadeContent />;
}
