"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BRAND, HOME_NAV, PRICE_USD } from "@/lib/config";
import { handleHomeSectionNav } from "@/lib/nav";
import { formatUsd, FRAMER_EASE } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
              {HOME_NAV.map((link) => {
                const href =
                  pathname === "/" && link.href.startsWith("/#")
                    ? link.href.slice(1)
                    : link.href;
                return (
                  <Link
                    key={link.href}
                    href={href}
                    onClick={(event) => {
                      const handled = handleHomeSectionNav(
                        link.href,
                        pathname,
                        event,
                      );
                      onClose();
                      if (!handled) return;
                    }}
                    className="font-display block border-b border-rule py-4 text-h2 text-ink"
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button
                href={buyHref}
                className="mt-6"
                onClick={(event) => {
                  onClose();
                  if (handleHomeSectionNav("/#buy", pathname, event)) return;
                }}
              >
                Sign up for pre-orders
              </Button>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
