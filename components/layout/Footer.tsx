"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BRAND, FOOTER_LINKS } from "@/lib/config";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { Button } from "@/components/ui/Button";
import { useFormAbuseFields } from "@/lib/form-abuse";
import { track } from "@/lib/track";

const LEGAL = [
  { href: "/legal/shipping", label: "Shipping" },
  { href: "/legal/returns", label: "Returns" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const abuse = useFormAbuseFields();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", ...abuse }),
      });
      if (!res.ok) throw new Error("waitlist failed");
      track("join_waitlist", { source: "footer" });
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      className="relative z-10 mt-auto border-t border-rule bg-ground"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <PrototypeBadge className="mb-4" />
            <h2 className="font-display text-h3">
              Stay in the wash
            </h2>
            <p className="mt-3 max-w-sm text-label leading-relaxed text-ink-muted">
              Fit trials, test results, and pre-order timing for the{" "}
              {BRAND.productName}. No spam. just product truth.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
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
                className="w-full rounded border border-rule bg-surface px-4 py-3 text-label outline-none placeholder:text-ink-muted focus:border-brand"
              />
              <Button
                type="submit"
                className="w-full shrink-0 sm:w-auto"
                loading={status === "sending"}
                error={status === "error"}
              >
                Join
              </Button>
            </form>
            {status === "ok" ? (
              <p className="mt-2 text-label text-brand">You&apos;re on the list.</p>
            ) : null}
            {status === "error" ? (
              <p className="mt-2 text-label text-ink">Enter a valid email.</p>
            ) : null}
          </div>

          <div>
            <p className="text-label text-ink-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-label">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label text-ink-muted">Legal</p>
            <ul className="mt-4 space-y-2 text-label">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href="/"
          className="font-display mt-16 block text-h2 leading-none"
          aria-label={BRAND.name}
        >
          {BRAND.name}
        </Link>

        <p className="mt-6 text-label text-ink-muted">
          © 2026 {BRAND.name}. {BRAND.productName}. Designed to keep water out.
        </p>
      </div>
    </footer>
  );
}
