import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteShell } from "@/components/layout/SiteShell";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { BRAND } from "@/lib/config";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Barlow_Condensed({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const body = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const viewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: SITE.description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  keywords: [
    "waterproof detailing glove",
    "car wash mitt glove",
    "detailing inner glove",
    "neoprene wash glove",
    BRAND.name,
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: BRAND.name,
    title: BRAND.name,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "2HANDS waterproof inner glove",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "2HANDS waterproof inner glove",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-ground font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <OrganizationJsonLd />
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
