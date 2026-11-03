"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartButton } from "@/components/commerce/CartButton";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
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
          "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          hidden ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
            scrolled || menuOpen
              ? "border-b border-border bg-background/70 backdrop-blur-xl"
              : "bg-transparent",
          )}
        >
          <Link
            href="/"
            className="font-display text-lg uppercase tracking-[0.08em] text-foreground"
          >
            {BRAND.name}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CartButton />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-glass lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span className="flex w-4 flex-col gap-1.5">
                <span
                  className={cn(
                    "h-px w-full bg-foreground transition-transform",
                    menuOpen && "translate-y-[3.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-foreground transition-opacity",
                    menuOpen && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-foreground transition-transform",
                    menuOpen && "-translate-y-[3.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
