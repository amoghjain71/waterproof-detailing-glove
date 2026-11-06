import { TESTERS } from "@/data/testers";

export function TesterQuotes() {
  if (TESTERS.length === 0) return null;

  return (
    <section className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-h2">From prototype testers</h2>
        <ul className="mt-8 border-t border-rule">
          {TESTERS.map((tester) => (
            <li key={`${tester.name}-${tester.date}`} className="border-b border-rule py-6">
              <p className="text-body text-ink">{tester.quote}</p>
              <p className="mt-3 text-label text-ink-muted">
                {tester.name}, {tester.city}, {tester.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
