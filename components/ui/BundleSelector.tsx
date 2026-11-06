"use client";

import { useState } from "react";
import { BUNDLES, MITT_SKU_AVAILABLE, type BundleId } from "@/lib/config";
import { formatUsd } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BundleSelector({
  value,
  onChange,
  disabled = false,
  error,
  compact = false,
}: {
  value?: BundleId;
  onChange?: (id: BundleId) => void;
  disabled?: boolean;
  error?: string;
  compact?: boolean;
}) {
  const [internal, setInternal] = useState<BundleId>("single");
  const selected = value ?? internal;

  const visible = BUNDLES.filter(
    (bundle) => bundle.enabled && (bundle.id !== "mitt" || MITT_SKU_AVAILABLE),
  );
  const single = BUNDLES.find((bundle) => bundle.id === "single");

  function choose(id: BundleId) {
    if (disabled) return;
    setInternal(id);
    onChange?.(id);
  }

  return (
    <fieldset disabled={disabled} className={cn(disabled && "opacity-40")}>
      <legend className="text-label text-ink">Pack</legend>
      <div className="mt-2 grid gap-2">
        {visible.map((bundle) => {
          const active = selected === bundle.id;
          const compareAt = (single?.priceUsd ?? 0) * bundle.pairs;
          const saves = bundle.pairs > 1 && bundle.priceUsd < compareAt;
          return (
            <label
              key={bundle.id}
              className={cn(
                "flex cursor-pointer items-start justify-between gap-4 border text-body",
                compact ? "p-3" : "p-4",
                active ? "border-ink bg-surface" : "border-rule bg-ground",
                "hover:border-ink",
              )}
            >
              <span>
                <input
                  type="radio"
                  name="bundle"
                  className="sr-only"
                  checked={active}
                  onChange={() => choose(bundle.id)}
                />
                <span className="block text-ink">{bundle.name}</span>
                {compact ? (
                  saves ? (
                    <span className="mt-1 block text-label text-ink-muted">
                      {bundle.note} Best value
                    </span>
                  ) : (
                    <span className="mt-1 block text-label text-ink-muted">{bundle.note}</span>
                  )
                ) : (
                  <>
                    <span className="mt-1 block text-label text-ink-muted">
                      {bundle.note}
                    </span>
                    {saves ? (
                      <span className="mt-1 block text-label text-ink">Best value</span>
                    ) : null}
                  </>
                )}
              </span>
              <span className="text-ink">{formatUsd(bundle.priceUsd)}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-label text-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
