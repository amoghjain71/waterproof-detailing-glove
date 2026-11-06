import { copy } from "@/content/copy";

export function KeywordMarquee() {
  return (
    <section
      className="border-y border-rule bg-surface px-4 py-8"
      aria-label="Product keywords"
    >
      <p className="mx-auto flex max-w-7xl flex-wrap gap-4 font-display text-h3 text-ink">
        {copy.keywordMarquee.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </p>
    </section>
  );
}
