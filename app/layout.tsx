import type { Metadata, Viewport } from "next";
import { Archivo_Black, DM_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteShell } from "@/components/layout/SiteShell";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { BRAND } from "@/lib/config";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${BRAND.name} — ${BRAND.productName}`,
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
    title: `${BRAND.name} — Wet job. Dry hands.`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1600,
        height: 1200,
        alt: "Waterproof Detailing Inner Glove in use with water beading on matte black surface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Wet job. Dry hands.`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
        className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <OrganizationJsonLd />
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
