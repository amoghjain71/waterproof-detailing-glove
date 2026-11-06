import { surveyMeta, surveyQuotes } from "@/content/survey";

export function SurveyWallSection() {
  return (
    <section className="border-t border-rule py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-h2">What detailers told us</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {surveyQuotes.map((quote) => (
            <li key={quote.id} className="border border-rule bg-surface p-4">
              <blockquote className="text-body text-ink">“{quote.text}”</blockquote>
              <p className="mt-3 text-label text-ink-muted">
                From our survey, not a customer review
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-label text-ink-muted">{surveyMeta.footnote}</p>
      </div>
    </section>
  );
}
