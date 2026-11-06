"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BRAND, HOME_NAV, PRICE_USD } from "@/lib/config";
import { formatUsd } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FRAMER_EASE } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const buyHref = pathname === "/" ? "#buy" : "/#buy";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 bg-ground lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: FRAMER_EASE }}
        >
          <div className="flex h-full flex-col px-6 pb-10 pt-menu">
            <div className="mb-8">
              <Image
                src="/images/brand/logo-mark.png"
                alt={BRAND.name}
                width={128}
                height={120}
                className="h-12 w-auto object-contain"
              />
            </div>
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {HOME_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={pathname === "/" ? link.href.slice(1) : link.href}
                  onClick={onClose}
                  className="font-display block border-b border-rule py-4 text-h2 text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Button href={buyHref} className="mt-6" onClick={onClose}>
                Pre-order · {formatUsd(PRICE_USD)}
              </Button>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
