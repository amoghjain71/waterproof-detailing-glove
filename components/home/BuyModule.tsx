"use client";

import { FormEvent, useState } from "react";
import { SIZE_CHART, sizeLabel, type SizeCode } from "@/data/sizes";
import type { BundleId } from "@/lib/config";
import { BundleSelector } from "@/components/ui/BundleSelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFormAbuseFields } from "@/lib/form-abuse";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const SIZES: SizeCode[] = ["S", "ML", "XL"];

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

export function BuyModule({
  size,
  bundleId,
  onOpenSizer,
  observe = false,
  compact = false,
}: {
  size: SizeCode;
  bundleId: BundleId;
  onSize: (size: SizeCode) => void;
  onBundle: (id: BundleId) => void;
  onOpenSizer?: () => void;
  observe?: boolean;
  /** Tighter spacing for the home hero fold. */
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | undefined>();
  const abuse = useFormAbuseFields();
  const sizeRow = SIZE_CHART.find((row) => row.code === size);
  const sample = SIZE_CHART.find((row) => row.code === "ML")?.sample;

  async function signup(event: FormEvent) {
    event.preventDefault();
    const phoneNorm = normalizePhone(phone);
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      setNotice("error");
      return;
    }
    if (phoneNorm.replace(/\D/g, "").length < 10) {
      setError("Enter a phone number we can text.");
      setNotice("error");
      return;
    }
    if (!consent) {
      setError("Agree to messages and emails to continue.");
      setNotice("error");
      return;
    }
    setNotice("sending");
    setError(undefined);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phoneNorm,
          size,
          source: "preorder-signup",
          consent: true,
          ...abuse,
        }),
      });
      if (!res.ok) throw new Error("signup failed");
      track("join_waitlist", { source: "preorder-signup", size });
      setNotice("ok");
      setEmail("");
      setPhone("");
      setConsent(false);
    } catch {
      setError("Could not sign you up. Try again.");
      setNotice("error");
    }
  }

  return (
    <div
      data-buy-module={observe ? "hero" : undefined}
      className={compact ? "mt-4" : "mt-8"}
    >
      <p className="text-label text-ink">Size</p>
      <div className="mt-2 flex gap-2">
        {SIZES.map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={size === code}
            aria-disabled
            disabled
            title="Sizes open when pre-orders start"
            className={cn(
              "h-12 min-w-12 border px-2 text-label",
              "cursor-not-allowed border-rule text-ink-muted opacity-40",
              size === code && "border-ink bg-surface text-ink opacity-50",
            )}
          >
            {sizeLabel(code)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-label text-ink-muted">
        {sizeRow?.code === "ML" && sample
          ? compact
            ? "M/L sample: hand circumference 200 to 215 mm. Sizes open with pre-orders."
            : `M/L sample: ${sample.overallLengthMm} mm length, ${sample.palmWidthLaidFlatMm} mm palm width, ${sample.middleFingerMm} mm middle finger, ${sample.cuffLengthMm} mm cuff. Hand circumference 200 to 215 mm. Sizes open with pre-orders.`
          : sizeRow?.note ?? "Size set finalizing."}
      </p>
      {onOpenSizer ? (
        <button
          type="button"
          onClick={onOpenSizer}
          className="mt-2 text-label text-brand"
        >
          Which size?
        </button>
      ) : null}

      <div className={compact ? "mt-3" : "mt-6"}>
        <BundleSelector
          value={bundleId}
          disabled
          compact={compact}
        />
      </div>

      <form className={compact ? "mt-3" : "mt-6"} onSubmit={signup}>
        <p className="text-body text-ink">Sign up for pre-orders</p>
        <p className="mt-1 text-label text-ink-muted">
          We will email and text when pre-orders open. No spam.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label="Email"
            name="preorder-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setNotice("idle");
            }}
            error={notice === "error" && error?.includes("email") ? error : undefined}
          />
          <Input
            label="Phone"
            name="preorder-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setNotice("idle");
            }}
            error={notice === "error" && error?.includes("phone") ? error : undefined}
          />
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-3 text-label text-ink">
          <input
            type="checkbox"
            name="preorder-consent"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              setNotice("idle");
            }}
            className="mt-1 h-4 w-4 shrink-0 rounded border border-rule accent-brand"
          />
          <span>
            I agree to receive emails and texts about pre-order status, product
            updates, and promotions. Message and data rates may apply. Reply STOP
            to opt out of texts. See{" "}
            <a href="/legal/privacy" className="text-brand">
              Privacy
            </a>
            .
          </span>
        </label>
        {notice === "error" &&
        error &&
        !error.includes("email") &&
        !error.includes("phone") ? (
          <p role="alert" className="mt-2 text-label text-ink">
            {error}
          </p>
        ) : null}
        <Button
          className="mt-3 w-full"
          type="submit"
          loading={notice === "sending"}
          error={notice === "error"}
        >
          Sign up for pre-orders
        </Button>
        {notice === "ok" ? (
          <p className="mt-2 text-label text-ink">
            You are on the list. We will email and text when pre-orders open.
          </p>
        ) : null}
      </form>
    </div>
  );
}
