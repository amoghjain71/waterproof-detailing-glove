"use client";

import { useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SizeFinder } from "@/components/sizing/SizeFinder";
import {
  MITT_COMPATIBILITY_NOTES,
  SIZE_CHART,
  type MittStyle,
} from "@/data/sizes";
import { cn } from "@/lib/utils";

const MEASURE_STEPS = [
  "Use a flexible tape — not a rigid ruler.",
  "Bare hand, fingers together, thumb excluded.",
  "Wrap around the widest knuckles (usually across the palm knuckles).",
  "Tape snug but not squeezed.",
  "Also note wrist circumference for cuff comfort.",
] as const;

export function SizingPageContent() {
  const [mitt, setMitt] = useState<MittStyle>("microfiber");

  return (
    <div>
      <PageHero
        eyebrow="Fit"
        title="Size finder"
        description="Measure bare-hand circumference around the widest knuckles — fingers together, thumb excluded — with a flexible tape, not squeezed. Also note wrist circumference for cuff comfort."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <AutoVideo
              id="sizing-measure"
              forceMissing
              className="aspect-video w-full"
            />
          </div>
          <ol className="space-y-2">
            {MEASURE_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 rounded-xl border border-border bg-glass px-4 py-3 text-sm text-muted"
              >
                <span className="font-display text-cyan">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Interactive finder
          </h2>
          <div className="mt-6">
            <SizeFinder />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Size chart
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-glass text-xs uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Hand circumference</th>
                  <th className="px-4 py-3">Sample dims</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.code} className="border-b border-border/70">
                    <td className="px-4 py-4 font-medium">{row.code}</td>
                    <td className="px-4 py-4 text-muted">
                      {row.circumferenceMm
                        ? `${row.circumferenceMm.min}–${row.circumferenceMm.max} mm`
                        : "Setting from fit trials"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {row.sample
                        ? `${row.sample.overallLengthMm} / ${row.sample.middleFingerMm} / ${row.sample.palmWidthLaidFlatMm} / ${row.sample.cuffLengthMm} mm`
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      {row.status === "confirmed" ? (
                        <span className="text-cyan">Confirmed</span>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {row.status === "pending" ? (
                        <Button href="/#waitlist-email" variant="ghost" className="!px-3 !py-1 text-xs">
                          Waitlist
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Sample dims for M: overall length / middle finger / palm width laid
            flat / cuff. 95 mm is palm width laid flat — not a hand-size range.
            Between sizes? Choose the larger. We will not invent S, L, or XL
            ranges.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Fits under your mitt
          </h2>
          <p className="mt-3 text-sm text-muted">
            Pick a mitt style for a friendly fit note — no invented
            measurements.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(Object.keys(MITT_COMPATIBILITY_NOTES) as MittStyle[]).map(
              (style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setMitt(style)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm capitalize",
                    mitt === style
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted",
                  )}
                >
                  {style}
                </button>
              ),
            )}
          </div>
          <p className="mt-6 max-w-2xl rounded-2xl border border-border bg-glass px-5 py-4 text-sm leading-relaxed text-foreground/90">
            {MITT_COMPATIBILITY_NOTES[mitt]}
          </p>
        </div>
      </section>
    </div>
  );
}
