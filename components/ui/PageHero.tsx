import { PrototypeBadge } from "@/components/ui/PrototypeBadge";

export function PageHero({
  eyebrow,
  title,
  description,
  showBadge = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  showBadge?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(31,123,255,0.18),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-4xl">
        {showBadge ? <PrototypeBadge className="mb-5" /> : null}
        {eyebrow ? (
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl uppercase tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
