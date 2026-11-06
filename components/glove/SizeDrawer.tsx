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
            className="fixed inset-0 z-overlay bg-ground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-drawer flex w-full max-w-md flex-col border-l border-rule bg-ground p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: FRAMER_EASE }}
            role="dialog"
            aria-modal
            aria-label="Which size?"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-h3">
                Which size?
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-rule px-3 py-1 text-label"
              >
                Close
              </button>
            </div>
            <p className="mb-6 text-label text-ink-muted">
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
              className="mt-8 text-label text-brand underline-offset-4 hover:underline"
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
