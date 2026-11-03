"use client";

import { surveyMeta, surveyQuotes } from "@/content/survey";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: readonly { id: string; text: string }[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div className="group overflow-hidden">
      <div
        className={`flex w-max gap-4 py-2 ${
          reverse ? "animate-marquee-rev" : "animate-marquee"
        }`}
      >
        {loop.map((q, i) => (
          <figure
            key={`${q.id}-${i}`}
            className="w-[min(80vw,360px)] shrink-0 rounded-2xl border border-border bg-glass px-5 py-4"
          >
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              “{q.text}”
            </blockquote>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.16em] text-cyan">
              From our survey · not a customer review
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function SurveyWallSection() {
  const rowA = surveyQuotes.slice(0, 3);
  const rowB = surveyQuotes.slice(3);

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan">Survey wall</p>
        <h2 className="font-display mt-3 text-3xl uppercase tracking-tight sm:text-5xl">
          What detailers told us
        </h2>
      </div>

      <div className="mt-10 space-y-4">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>

      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-muted sm:px-6 lg:px-8">
        {surveyMeta.footnote}
      </p>
    </section>
  );
}
