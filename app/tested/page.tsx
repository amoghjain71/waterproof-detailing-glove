import type { Metadata } from "next";
import { TestedPageContent } from "@/components/tested/TestedPageContent";

export const metadata: Metadata = {
  title: "Tested",
  description:
    "Leak, cuff, flex, and strap tests for the 2HANDS glove. We publish every result, including failures.",
};

export default function TestedPage() {
  return <TestedPageContent />;
}
