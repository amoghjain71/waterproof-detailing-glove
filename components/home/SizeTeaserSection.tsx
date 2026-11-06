"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { recommendSize } from "@/data/sizes";
import { Button } from "@/components/ui/Button";
import { HandMeasureDiagram } from "@/components/sizing/HandMeasureDiagram";

type Unit = "mm" | "cm" | "in";

function toMm(value: number, unit: Unit): number {
  if (unit === "cm") return value * 10;
  if (unit === "in") return value * 25.4;
  return value;
}

function formatRaw(value: number, unit: Unit): string {
  if (unit === "mm") return `${Math.round(value)} mm`;
  if (unit === "cm") return `${value.toFixed(1)} cm`;
  return `${value.toFixed(1)} in`;
}

export function SizeTeaserSection() {
  const [unit, setUnit] = useState<Unit>("mm");
  const [raw, setRaw] = useState(205);
  const mm = useMemo(() => Math.round(toMm(raw, unit)), [raw, unit]);
  const result = recommendSize(mm);
  const scale = Math.min(1.28, Math.max(0.82, mm / 205));

  return (
    <section className="border-t border-rule px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-label text-brand">Size finder</p>
        <h2 className="font-display mt-3 max-w-3xl text-h2 sm:text-h1">
          Measure once. Wash right.
        </h2>
        <p className="mt-4 max-w-2xl text-label leading-relaxed text-ink-muted">
          Bare-hand circumference around the widest knuckles. fingers together,
          thumb excluded. M is confirmed at 200–215 mm; L (216–230) and XL
          (231–250) are graded from that sample and standard work-glove steps. S
          is still pending.
        </p>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded border border-rule bg-surface p-6">
            <div className="inline-flex w-fit rounded border border-rule p-1">
              {(["mm", "cm", "in"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`h-12 rounded border px-4 text-label ${
                    unit === u ? "bg-brand text-on-brand" : "text-ink-muted"
                  }`}
                  onClick={() => {
                    setUnit(u);
                    if (u === "mm") setRaw(205);
                    if (u === "cm") setRaw(20.5);
                    if (u === "in") setRaw(8.1);
                  }}
                >
                  {u}
                </button>
              ))}
            </div>

            <label className="mt-6 block text-label text-ink-muted">
              Hand circumference ({unit})
              <input
                type="range"
                min={unit === "in" ? 6 : unit === "cm" ? 15 : 150}
                max={unit === "in" ? 11 : unit === "cm" ? 28 : 280}
                step={unit === "mm" ? 1 : 0.1}
                value={raw}
                onChange={(e) => setRaw(Number(e.target.value))}
                className="size-range mt-4 w-full"
              />
            </label>

            <p className="mt-4 font-display text-h3 text-brand">
              {formatRaw(raw, unit)}
              {unit !== "mm" ? (
                <span className="ml-2 text-label font-sans text-ink-muted">({mm} mm)</span>
              ) : null}
            </p>

            <p className="mt-4 rounded border border-rule bg-ground px-4 py-3 text-label leading-relaxed">
              {result.message}
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Button href="/sizing" variant="outline">
                Open full sizing guide
              </Button>
              {!result.code ? (
                <Link href="#final-cta" className="self-center text-label text-brand">
                  Join the waitlist
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col rounded border border-rule bg-surface p-6">
            <div className="flex flex-1 items-center justify-center py-4">
              <HandMeasureDiagram mm={mm} scale={scale} />
            </div>
            <p className="mt-2 text-label leading-relaxed text-ink-muted">
              Measure around the widest knuckles with fingers together and thumb
              out. snug tape, not squeezed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
