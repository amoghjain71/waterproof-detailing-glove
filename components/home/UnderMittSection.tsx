"use client";

import { AutoVideo } from "@/components/media/AutoVideo";
import { copy } from "@/content/copy";

export function UnderMittSection() {
  return (
    <section className="border-t border-rule px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-label text-brand">Under the mitt</p>
        <h2 className="font-display mt-3 max-w-3xl text-h2 sm:text-h1">
          {copy.underTheMitt}
        </h2>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded border border-rule bg-surface p-6">
            <div className="relative aspect-mitt overflow-hidden rounded">
              <AutoVideo
                id="mitt-swap"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-4 text-label leading-relaxed text-ink-muted">
              The mitt slides on over the glove: efficient and effective.
            </p>
          </div>

          <div className="flex flex-col overflow-hidden rounded border border-rule bg-surface p-6">
            <div className="relative aspect-mitt overflow-hidden rounded">
              <AutoVideo
                id="full-wash-in-use"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-4 text-label leading-relaxed text-ink-muted">
              Put the glove on once at the start of a wash. Swap mitts in seconds
              while keeping bucket water off your hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
