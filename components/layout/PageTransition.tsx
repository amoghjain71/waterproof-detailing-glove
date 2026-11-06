"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FRAMER_EASE } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="relative flex min-h-full w-full min-w-0 flex-1 flex-col">
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-drawer bg-brand"
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 0 }}
          exit={{ scaleY: 1, originY: 1 }}
          transition={{ duration: 0.2, ease: FRAMER_EASE }}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: FRAMER_EASE }}
          className="flex min-h-full w-full min-w-0 flex-1 flex-col"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
