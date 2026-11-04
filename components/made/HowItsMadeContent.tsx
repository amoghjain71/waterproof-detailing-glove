"use client";

import { useEffect, useRef, useState } from "react";
import { AutoVideo } from "@/components/media/AutoVideo";
import { PageHero } from "@/components/ui/PageHero";
import { copy } from "@/content/copy";
import type { VideoId } from "@/content/videos";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const MATERIALS = [
  {
    title: "Outer nylon",
    front: "Matte-black stretch nylon",
    back: "Water-repellent surface. No raised grip, no body logos — paint-safe contact under a mitt.",
  },
  {
    title: "Neoprene core",
    front: "1.0 mm closed-cell foam",
    back: "Thin barrier designed to keep water off skin while preserving mitt feel.",
  },
  {
    title: "Tricot lining",
    front: "Smooth polyester tricot",
    back: "Low-friction inner facing for easier don and doff when hands are wet.",
  },
  {
    title: "Silicone lip",
    front: "Soft sealing lip",
    back: "Inside the 60 mm cuff — engineered cuff seal against wrist ingress.",
  },
  {
    title: "Wrist strap",
    front: "25 mm hook-and-loop",
    back: "Low-profile, no exposed metal. Designed to sit under the wash mitt.",
  },
  {
    title: "Sealed seams",
    front: "Bonded joints",
    back: "Every seam is treated as a leak path. Bonded and sealed end to end.",
  },
] as const;

const BUILD_STEPS: {
  title: string;
  body: string;
  video: VideoId;
}[] = [
  {
    title: "Inspect laminate",
    body: "Check facing continuity and foam gauge before cutting.",
    video: "making-inspect",
  },
  {
    title: "Cut mirrored left / right",
    body: "Paired patterns so every box ships a matched set.",
    video: "making-cut",
  },
  {
    title: "Bond the body",
    body: "Join the laminate panels with controlled seam bulk.",
    video: "making-bond",
  },
  {
    title: "Seal every joint",
    body: "Seal critical paths — gloves leak at seams first.",
    video: "making-seal",
  },
  {
    title: "Light reinforcement",
    body: "Reinforce stress points without adding mitt-blocking thickness.",
    video: "making-reinforce",
  },
  {
    title: "Attach lip and strap",
    body: "Install silicone sealing lip and 25 mm low-profile strap.",
    video: "making-strap",
  },
  {
    title: "Finish",
    body: "Trim, inspect surfaces, confirm left/right pairing.",
    video: "making-finish",
  },
  {
    title: "Cure and test",
    body: "Cure cycle, then validation gates for seams and cuff.",
    video: "making-leak-test",
  },
];

function FlipCard({
  title,
  front,
  back,
}: {
  title: string;
  front: string;
  back: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className="group h-44 w-full [perspective:1000px]"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-2xl border border-border transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-glass p-5 [backface-visibility:hidden]">
          <p className="font-display text-lg uppercase tracking-tight text-accent">
            {title}
          </p>
          <p className="text-sm text-muted">{front}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-cyan">
            Flip
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center rounded-2xl bg-accent/15 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-relaxed text-foreground">{back}</p>
        </div>
      </div>
    </button>
  );
}

export function HowItsMadeContent() {
  const stepperRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = stepperRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const i = Math.min(
                BUILD_STEPS.length - 1,
                Math.floor(self.progress * BUILD_STEPS.length),
              );
              setStep(i);
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const active = BUILD_STEPS[step] ?? BUILD_STEPS[0]!;

  return (
    <div>
      <PageHero
        eyebrow="Construction"
        title="How it's made"
        description="A three-layer laminate glove with bonded seams and an engineered cuff — built to stay thin under a wash mitt."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border">
          <AutoVideo id="making-lamination-cutting" className="aspect-video w-full" />
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl uppercase tracking-tight">
            Materials
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Hover or tap a card to flip — what each layer and detail is for.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MATERIALS.map((m) => (
              <FlipCard key={m.title} {...m} />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={stepperRef}
        className="border-t border-border px-4 py-16 lg:px-8"
      >
        <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight">
              Build
            </h2>
            <ol className="mt-8 space-y-2">
              {BUILD_STEPS.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                      i === step
                        ? "border-accent bg-accent/10"
                        : "border-border bg-glass",
                    )}
                  >
                    <span className="font-display text-sm text-cyan">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{s.title}</span>
                      <span className="mt-1 block text-xs text-muted">
                        {s.body}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <AutoVideo
              key={active.video}
              id={active.video}
              className="aspect-video w-full"
            />
            <p className="border-t border-border bg-glass px-4 py-3 text-sm text-muted">
              Step {step + 1}: {active.title}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight">
              Why seams matter
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A glove leaks at seams and cuff. That is why every joint is bonded
              and sealed, and why the cuff is tested separately from the body in
              the validation program. Intent language only until those gates
              pass.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight">
              Quality control
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="rounded-xl border border-border px-4 py-3">
                Seam continuity check on every pair
              </li>
              <li className="rounded-xl border border-border px-4 py-3">
                Lip integrity inspection
              </li>
              <li className="rounded-xl border border-border px-4 py-3">
                Strap operation cycle
              </li>
              <li className="rounded-xl border border-border px-4 py-3">
                Matching left / right confirmation
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl text-xs text-muted">
          Preview steps also appear on the home scroll story (
          {copy.makingSteps.length} cards). Full build lives here.
        </p>
      </section>
    </div>
  );
}
