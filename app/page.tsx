import type { Metadata } from "next";
import { HomeStory } from "@/components/home/HomeStory";
import { BRAND } from "@/lib/config";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${BRAND.name} | Waterproof inner glove for car detailing, $29.99`,
  },
  description:
    "A thin waterproof inner glove designed to live under your wash mitt. Put it on once. Swap mitts in seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND.name} | Waterproof inner glove for car detailing, $29.99`,
    description: SITE.description,
    url: SITE.url,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Waterproof inner glove for car detailing, $29.99`,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
};

export default function HomePage() {
  return <HomeStory />;
}
