"use client";

import { FormEvent, useState } from "react";
import { SIZE_CHART, type SizeCode } from "@/data/sizes";
import {
  BUNDLES,
  BRAND,
  SIZES_CONFIRMED,
  type BundleId,
} from "@/lib/config";
import { useCart } from "@/lib/store/cart";
import { BundleSelector } from "@/components/ui/BundleSelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PreorderTerms } from "@/components/commerce/OfferNotes";
import { useFormAbuseFields } from "@/lib/form-abuse";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const SIZES: SizeCode[] = ["S", "M", "L", "XL"];

export function BuyModule({
  size,
  bundleId,
  onSize,
  onBundle,
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
  const addItem = useCart((s) => s.addItem);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const abuse = useFormAbuseFields();
  const bundle = BUNDLES.find((item) => item.id === bundleId) ?? BUNDLES[0];
  const sample = SIZE_CHART.find((row) => row.code === "M")?.sample;
  const canBuy = SIZES_CONFIRMED
    ? SIZE_CHART.find((row) => row.code === size)?.status === "confirmed"
    : size === "M";

  async function preorder() {
    if (!canBuy || !bundle) return;
    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, 200));
    addItem({
      size,
      qty: 1,
      sku: bundle.id === "single" ? BRAND.sku : bundle.id,
    });
    track("add_to_cart", { size, bundle: bundle.id, price: bundle.priceUsd });
    setBusy(false);
  }

  async function notify(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setNotice("error");
      return;
    }
    setNotice("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, size, source: "size-notify", ...abuse }),
      });
      if (!res.ok) throw new Error("notify failed");
      track("notify_size", { size });
      track("join_waitlist", { source: "size-notify", size });
      setNotice("ok");
      setEmail("");
    } catch {
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
            onClick={() => {
              onSize(code);
              track("select_size", { size: code });
            }}
            className={cn(
              "h-12 w-12 border text-label",
              size === code ? "border-ink bg-surface text-ink" : "border-rule text-ink-muted",
            )}
          >
            {code}
          </button>
        ))}
      </div>
      {size === "M" && sample ? (
        <p className="mt-2 text-label text-ink-muted">
          {compact
            ? `Size M sample: hand circumference 200 to 215 mm.`
            : `Size M sample: ${sample.overallLengthMm} mm length, ${sample.palmWidthLaidFlatMm} mm palm width, ${sample.middleFingerMm} mm middle finger, ${sample.cuffLengthMm} mm cuff. Hand circumference 200 to 215 mm.`}
        </p>
      ) : (
        <p className="mt-2 text-label text-ink">Size set finalizing.</p>
      )}
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
          onChange={(id) => {
            onBundle(id);
            track("select_bundle", { bundle: id });
          }}
          compact={compact}
        />
      </div>

      {canBuy ? (
        <Button className={cn("w-full", compact ? "mt-3" : "mt-6")} loading={busy} onClick={preorder}>
          Pre-order
        </Button>
      ) : (
        <form className={compact ? "mt-3" : "mt-6"} onSubmit={notify}>
          <Input
            label="Email for this size"
            name="notify-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={notice === "error" ? "Enter a valid email." : undefined}
          />
          <Button className="mt-3 w-full" type="submit" loading={notice === "sending"}>
            Notify me
          </Button>
          {notice === "ok" ? (
            <p className="mt-2 text-label text-ink">You are on the list for size {size}.</p>
          ) : null}
        </form>
      )}

      <div className="mt-3">
        <PreorderTerms />
      </div>
    </div>
  );
}
