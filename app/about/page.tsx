import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Founder story: from lined mitt to under-mitt glove after a survey of 62 detailers and enthusiasts.",
};

export default function AboutPage() {
  return <AboutContent />;
}
