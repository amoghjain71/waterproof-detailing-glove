"use client";

import { useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "mitt", label: "Under the mitt" },
  { id: "layers", label: "Layers" },
  { id: "cuff", label: "Cuff" },
  { id: "size", label: "Size M" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function ProductViewer() {
  const [view, setView] = useState<ViewId>("mitt");

  return (
    <div>
      <div className="border border-rule bg-surface">
        {view === "mitt" ? (
          <AutoVideo id="mitt-swap" className="aspect-portrait w-full" priority />
        ) : (
          <div className="aspect-portrait bg-ground p-6">
            {view === "layers" ? <LayersDiagram /> : null}
            {view === "cuff" ? <CuffDiagram /> : null}
            {view === "size" ? <SizeDiagram /> : null}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Product views">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={view === item.id}
            onClick={() => setView(item.id)}
            className={cn(
              "h-12 border px-3 text-label",
              view === item.id ? "border-ink bg-surface text-ink" : "border-rule text-ink-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LayersDiagram() {
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-label="Three-layer cross-section">
      <rect x="40" y="70" width="240" height="48" fill="var(--ink)" />
      <text x="52" y="100" fill="var(--surface)" fontSize="16">
        Matte nylon
      </text>
      <rect x="40" y="134" width="240" height="72" fill="var(--ink-muted)" />
      <text x="52" y="176" fill="var(--surface)" fontSize="16">
        1 mm neoprene
      </text>
      <rect x="40" y="222" width="240" height="48" fill="var(--rule)" />
      <text x="52" y="252" fill="var(--ink)" fontSize="16">
        Smooth tricot
      </text>
      <text x="40" y="320" fill="var(--ink-muted)" fontSize="14">
        Target finished laminate 1.8 mm or thinner
      </text>
    </svg>
  );
}

function CuffDiagram() {
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-label="Cuff seal with silicone lip and 25 mm strap">
      <rect x="70" y="80" width="180" height="200" fill="none" stroke="var(--ink)" strokeWidth="8" />
      <path d="M78 250 C120 280, 200 280, 242 250" fill="none" stroke="var(--ink)" strokeWidth="6" />
      <text x="40" y="320" fill="var(--ink)" fontSize="16">
        Silicone lip
      </text>
      <rect x="70" y="340" width="180" height="16" fill="var(--ink-muted)" />
      <text x="40" y="380" fill="var(--ink)" fontSize="16">
        25 mm strap, under the mitt
      </text>
    </svg>
  );
}

function SizeDiagram() {
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-label="Size M sample targets">
      <path
        d="M110 40 C100 80, 96 140, 100 220 C104 280, 120 320, 160 340 C200 320, 216 280, 220 220 C224 140, 220 80, 210 40"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="6"
      />
      <text x="40" y="80" fill="var(--ink)" fontSize="14">
        260 mm length
      </text>
      <text x="40" y="160" fill="var(--ink)" fontSize="14">
        95 mm palm width
      </text>
      <text x="40" y="220" fill="var(--ink)" fontSize="14">
        80 mm middle finger
      </text>
      <text x="40" y="300" fill="var(--ink)" fontSize="14">
        60 mm cuff
      </text>
      <text x="40" y="370" fill="var(--ink-muted)" fontSize="14">
        Sample targets
      </text>
    </svg>
  );
}
