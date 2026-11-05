"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SizeFinder } from "@/components/sizing/SizeFinder";
import { FRAMER_EASE } from "@/lib/utils";
import type { SizeCode } from "@/data/sizes";

export function SizeDrawer({
  open,
  onClose,
  onRecommend,
}: {
  open: boolean;
  onClose: () => void;
  onRecommend?: (code: SizeCode | null) => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close size finder"
            className="fixed inset-0 z-[110] bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[120] flex w-full max-w-md flex-col border-l border-border bg-background p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: FRAMER_EASE }}
            role="dialog"
            aria-modal
            aria-label="Which size?"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase tracking-tight">
                Which size?
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            <p className="mb-6 text-sm text-muted">
              Measure bare-hand circumference around the widest knuckles. Between
              sizes? Choose the larger. M is the measured sample; L and XL are
              graded from it. S is still pending.
            </p>
            <SizeFinder
              onRecommend={(code) => {
                if (code) onRecommend?.(code);
              }}
            />
            <Link
              href="/sizing"
              className="mt-8 text-sm text-cyan underline-offset-4 hover:underline"
              onClick={onClose}
            >
              Open full sizing guide
            </Link>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
