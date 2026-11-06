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
    <section className="relative border-b border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl">
        {showBadge ? <PrototypeBadge className="mb-5" /> : null}
        {eyebrow ? (
          <p className="mb-3 text-label text-ink-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-h2 sm:text-h1 lg:text-h1">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-body leading-relaxed text-ink-muted sm:text-lead">
          {description}
        </p>
      </div>
    </section>
  );
}
