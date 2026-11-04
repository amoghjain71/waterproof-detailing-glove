"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/config";
import { FRAMER_EASE } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: FRAMER_EASE }}
        >
          <div className="flex h-full flex-col px-6 pb-10 pt-[calc(var(--header-h)+1.5rem)]">
            <div className="mb-8">
              <Image
                src="/images/brand/logo-mark.png"
                alt={BRAND.name}
                width={96}
                height={60}
                className="h-8 w-auto object-contain"
              />
            </div>
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: FRAMER_EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="font-display block border-b border-border py-4 text-3xl uppercase tracking-tight text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: FRAMER_EASE }}
              >
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="mt-6 inline-flex text-sm text-cyan"
                >
                  Contact
                </Link>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
