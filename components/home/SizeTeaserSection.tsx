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
  const fillPct = useMemo(() => {
    const min = unit === "in" ? 6 : unit === "cm" ? 15 : 150;
    const max = unit === "in" ? 11 : unit === "cm" ? 28 : 280;
    return ((raw - min) / (max - min)) * 100;
  }, [raw, unit]);

  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan">Size finder</p>
        <h2 className="font-display mt-3 max-w-3xl text-3xl uppercase tracking-tight sm:text-5xl">
          Measure once. Wash right.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Bare-hand circumference around the widest knuckles — fingers together,
          thumb excluded. Size M is confirmed at 200–215 mm. S, L, and XL are
          still being set from fit trials.
        </p>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-border bg-glass p-6">
            <div className="inline-flex w-fit rounded-full border border-border p-1">
              {(["mm", "cm", "in"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${
                    unit === u ? "bg-accent text-white" : "text-muted"
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

            <label className="mt-6 block text-sm text-muted">
              Hand circumference ({unit})
              <input
                type="range"
                min={unit === "in" ? 6 : unit === "cm" ? 15 : 150}
                max={unit === "in" ? 11 : unit === "cm" ? 28 : 280}
                step={unit === "mm" ? 1 : 0.1}
                value={raw}
                onChange={(e) => setRaw(Number(e.target.value))}
                className="size-range mt-4 w-full"
                style={{
                  background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${fillPct}%, rgba(255,255,255,0.22) ${fillPct}%, rgba(255,255,255,0.22) 100%)`,
                }}
              />
            </label>

            <p className="mt-4 font-display text-2xl text-accent">
              {formatRaw(raw, unit)}
              {unit !== "mm" ? (
                <span className="ml-2 text-sm font-sans text-muted">({mm} mm)</span>
              ) : null}
            </p>

            <p className="mt-4 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed">
              {result.message}
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Button href="/sizing" variant="outline">
                Open full sizing guide
              </Button>
              {!result.code ? (
                <Link href="#final-cta" className="self-center text-sm text-cyan">
                  Join the waitlist
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-glass p-6">
            <div className="flex flex-1 items-center justify-center py-4">
              <HandMeasureDiagram mm={mm} scale={scale} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Measure around the widest knuckles with fingers together and thumb
              out — snug tape, not squeezed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
