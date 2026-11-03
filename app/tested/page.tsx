import type { Metadata } from "next";
import { TestedPageContent } from "@/components/tested/TestedPageContent";

export const metadata: Metadata = {
  title: "Tested",
  description:
    "Durability and reliability testing program for the Waterproof Detailing Inner Glove. We show every result, passed or not.",
};

export default function TestedPage() {
  return <TestedPageContent />;
}
