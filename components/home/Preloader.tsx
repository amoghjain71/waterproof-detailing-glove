"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FRAMER_EASE } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const KEY = "2hands-preloader-seen";

export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced) return;

    let hideTimer = 0;
    const startTimer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(KEY)) return;
        sessionStorage.setItem(KEY, "1");
        setShow(true);
        hideTimer = window.setTimeout(() => setShow(false), 1600);
      } catch {
        setShow(false);
      }
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(hideTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-overlay flex items-center justify-center bg-ground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: FRAMER_EASE }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0 bg-brand"
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1, originY: 1 }}
            transition={{ duration: 0.55, ease: FRAMER_EASE, delay: 0.35 }}
          />
          <motion.div
            className="relative z-10 h-10 w-7 bg-ink"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: FRAMER_EASE }}
          />
          <motion.div
            className="absolute inset-0 bg-ground"
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1, originY: 1 }}
            transition={{ duration: 0.45, ease: FRAMER_EASE, delay: 1.05 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
