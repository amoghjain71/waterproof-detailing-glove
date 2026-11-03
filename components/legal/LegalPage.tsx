import { PageHero } from "@/components/ui/PageHero";
import { BRAND } from "@/lib/config";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHero
        eyebrow="Draft"
        title={title}
        description={`Draft legal copy for ${BRAND.name}. Final terms will be confirmed before live fulfillment.`}
      />
      <section className="mx-auto max-w-3xl px-4 py-14 text-sm leading-relaxed text-muted lg:px-8">
        <p className="mb-6 rounded-xl border border-border bg-glass px-4 py-3 text-xs uppercase tracking-[0.16em] text-cyan">
          Draft — not final legal advice
        </p>
        <div className="space-y-4">{children}</div>
      </section>
    </div>
  );
}
