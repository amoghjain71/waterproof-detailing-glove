"use client";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { SiteTracking } from "@/components/providers/SiteTracking";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SiteTracking />
      <ScrollProgress />
      <CartDrawer />
      <PageTransition>{children}</PageTransition>
    </MotionProvider>
  );
}
