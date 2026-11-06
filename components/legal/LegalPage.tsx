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
        title={title}
        description={`Draft for ${BRAND.name}. These terms are confirmed before the first shipment.`}
      />
      <section className="mx-auto max-w-3xl px-4 py-14 text-body leading-relaxed text-ink-muted lg:px-8">
        <p className="mb-6 border border-rule bg-surface px-4 py-3 text-label text-ink">
          Draft. This is not legal advice.
        </p>
        <div className="space-y-4">{children}</div>
      </section>
    </div>
  );
}
