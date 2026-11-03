"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/config";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";

const LEGAL = [
  { href: "/legal/shipping", label: "Shipping" },
  { href: "/legal/returns", label: "Returns" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error("waitlist failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      className="relative mt-auto border-t border-border bg-background"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <PrototypeBadge className="mb-4" />
            <h2 className="font-display text-2xl uppercase tracking-tight">
              Stay in the wash
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Fit trials, test results, and pre-order timing for the{" "}
              {BRAND.productName}. No spam — just product truth.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex max-w-md gap-2">
              <label className="sr-only" htmlFor="waitlist-email">
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="you@shop.com"
                className="w-full rounded-full border border-border bg-glass px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-cyan/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
              >
                Join
              </button>
            </form>
            {status === "ok" ? (
              <p className="mt-2 text-xs text-cyan">You&apos;re on the list.</p>
            ) : null}
            {status === "error" ? (
              <p className="mt-2 text-xs text-red-300">Enter a valid email.</p>
            ) : null}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground/90 hover:text-cyan">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-foreground/90 hover:text-cyan">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground/90 hover:text-cyan">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href="/"
          className="water-fill-wordmark font-display mt-16 block text-center text-[clamp(3.5rem,18vw,14rem)] uppercase leading-none tracking-[-0.05em]"
          aria-label={BRAND.name}
        >
          {BRAND.name}
        </Link>

        <p className="mt-6 text-center text-xs text-muted">
          © 2026 {BRAND.name}. {BRAND.productName} · SKU {BRAND.sku}. Designed
          to keep water out — Prototype V2.
        </p>
      </div>
    </footer>
  );
}
