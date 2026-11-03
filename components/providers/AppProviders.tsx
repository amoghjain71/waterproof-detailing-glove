"use client";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartDrawer } from "@/components/commerce/CartDrawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <ScrollProgress />
      <CustomCursor />
      <CartDrawer />
      <PageTransition>{children}</PageTransition>
    </MotionProvider>
  );
}
