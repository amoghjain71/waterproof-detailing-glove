"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, duration: 0.3, bounce: 0 };

export function Swap({
  swapKey,
  children,
  className,
  scaleFrom = 0.25,
}: {
  swapKey: string | number;
  children: React.ReactNode;
  className?: string;
  scaleFrom?: number;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={swapKey}
        className={cn("inline-flex", className)}
        initial={{ opacity: 0, scale: scaleFrom, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: scaleFrom, filter: "blur(4px)" }}
        transition={SPRING}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
