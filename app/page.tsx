import type { Metadata } from "next";
import { HomeStory } from "@/components/home/HomeStory";
import { BRAND } from "@/lib/config";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${BRAND.name} — Wet job. Dry hands.`,
  description:
    "A thin waterproof inner glove designed to live under your wash mitt. Put it on once. Swap mitts in seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND.name} — Wet job. Dry hands.`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, alt: BRAND.productName }],
  },
};

export default function HomePage() {
  return <HomeStory />;
}
