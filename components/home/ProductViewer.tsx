"use client";

import { useState } from "react";
import Image from "next/image";
import { AutoVideo } from "@/components/media/AutoVideo";
import { cn } from "@/lib/utils";

const VIEWS = [
  {
    id: "mitt",
    label: "Under the mitt",
    kind: "video" as const,
    video: "mitt-swap" as const,
  },
  {
    id: "layers",
    label: "Layers",
    kind: "image" as const,
    src: "/images/glove/09-material-layers.jpg",
    alt: "Matte nylon, 1 mm neoprene, and smooth tricot stacked as the glove laminate",
    frame: "portrait" as const,
  },
  {
    id: "cuff",
    label: "Cuff",
    kind: "image" as const,
    src: "/images/glove/07-cuff-strap.jpg",
    alt: "Cuff opening with the 25 mm strap at the wrist",
    frame: "portrait" as const,
  },
  {
    id: "size",
    label: "Size M/L",
    kind: "image" as const,
    src: "/images/glove/05-flexibility.jpg",
    alt: "Size M/L glove on a hand, fist and open fingers",
    // Wide diptych (1024x571) — keep full frame on mobile instead of portrait crop.
    frame: "wide" as const,
  },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function ProductViewer() {
  const [view, setView] = useState<ViewId>("mitt");
  const active = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  return (
    <div>
      <div className="overflow-hidden border border-rule bg-surface">
        {active.kind === "video" ? (
          <AutoVideo
            id={active.video}
            className="aspect-portrait w-full object-cover lg:aspect-auto lg:h-hero-media"
            priority
          />
        ) : active.frame === "wide" ? (
          <div className="flex w-full items-center justify-center lg:h-hero-media">
            <Image
              src={active.src}
              alt={active.alt}
              width={1024}
              height={571}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="h-auto w-full max-w-full object-contain lg:h-full lg:w-auto"
            />
          </div>
        ) : (
          <div className="relative aspect-portrait w-full lg:aspect-auto lg:h-hero-media">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
              priority={active.id === "layers"}
            />
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
