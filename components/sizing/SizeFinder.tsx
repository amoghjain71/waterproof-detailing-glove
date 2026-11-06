"use client";

import { useEffect, useMemo, useState } from "react";
import { recommendSize, type SizeCode } from "@/data/sizes";
import { HandMeasureDiagram } from "@/components/sizing/HandMeasureDiagram";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

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

export function SizeFinder({
  className,
  onRecommend,
}: {
  className?: string;
  onRecommend?: (code: SizeCode | null, mm: number) => void;
}) {
  const [unit, setUnit] = useState<Unit>("mm");
  const [raw, setRaw] = useState(205);
  const mm = useMemo(() => Math.round(toMm(raw, unit)), [raw, unit]);
  const result = recommendSize(mm);
  const scale = Math.min(1.28, Math.max(0.82, mm / 205));

  useEffect(() => {
    track("open_size_calculator", { surface: "sizing-page" });
  }, []);

  return (
    <div className={cn("grid items-stretch gap-6 sm:grid-cols-2", className)}>
      <div className="flex flex-col rounded border border-rule bg-surface p-6">
        <div className="inline-flex w-fit rounded border border-rule p-1">
          {(["mm", "cm", "in"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              className={cn(
                "rounded px-4 py-2 text-label",
                unit === u ? "bg-brand text-on-brand" : "text-ink-muted",
              )}
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
            onChange={(e) => {
              const v = Number(e.target.value);
              setRaw(v);
              const nextMm = Math.round(toMm(v, unit));
              const rec = recommendSize(nextMm);
              onRecommend?.(rec.code, nextMm);
            }}
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
  );
}
