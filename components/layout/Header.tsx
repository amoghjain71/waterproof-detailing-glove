"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BRAND,
  FREE_SHIPPING_OVER_USD,
  HOME_NAV,
  SHIP_ESTIMATE_TEXT,
} from "@/lib/config";
import { handleHomeSectionNav } from "@/lib/nav";
import { cn, formatUsd } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartButton } from "@/components/commerce/CartButton";

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 80 && !menuOpen);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-rule bg-ground transition-transform duration-200 ease-wash motion-reduce:transition-none",
          hidden ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <p className="mx-auto flex h-announce w-full max-w-7xl items-center px-4 text-label text-ink sm:px-6 lg:px-8">
          <span className="min-w-0 sm:hidden">
            Sign up for pre-orders. Free shipping over{" "}
            {formatUsd(FREE_SHIPPING_OVER_USD)}.
          </span>
          <span className="hidden min-w-0 sm:inline">
            Sign up for pre-orders. {SHIP_ESTIMATE_TEXT} Free shipping over{" "}
            {formatUsd(FREE_SHIPPING_OVER_USD)}.
          </span>
        </p>
        <div className="mx-auto flex h-header max-w-7xl items-center justify-between border-t border-rule px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-ink"
            aria-label={BRAND.name}
          >
            <Image
              src="/images/brand/logo-mark.png"
              alt=""
              width={128}
              height={120}
              className="h-11 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
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
                    handleHomeSectionNav(link.href, pathname, event);
                  }}
                  className="text-label text-ink-muted transition-colors duration-200 ease-wash hover:text-ink"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <CartButton />

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center border border-ink px-4 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="text-label">{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
