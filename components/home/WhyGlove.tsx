const ROWS = [
  {
    title: "Swap speed",
    quote:
      "I personally wouldn't prefer the strap as I'm big in efficiency, I will have to swap between 2-4 mitts for a full contact wash.",
    answer: "Wear the glove once and swap the mitts over it.",
  },
  {
    title: "Bucket",
    quote:
      "Somehow design it so when you put it back in the wash bucket the inside doesn't get wet.",
    answer: "The mitt can soak while the glove stays on your hand.",
  },
  {
    title: "Paint",
    quote: "Make sure the wrist strap is inside the mitt so it doesn't scratch the paint.",
    answer: "The strap sits under the mitt cuff.",
  },
];

export function WhyGlove() {
  return (
    <section className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 data-path-point className="relative z-10 font-display max-w-3xl text-h2">
          Why a glove, not a lined mitt
        </h2>
        <p className="relative z-10 mt-4 text-label text-ink-muted">
          From our survey, not a customer review.
        </p>
        <div className="relative z-10 mt-8 border-t border-rule">
          {ROWS.map((row) => (
            <article key={row.title} className="grid gap-4 border-b border-rule py-6 lg:grid-cols-12">
              <h3 className="font-display text-h3 lg:col-span-3">{row.title}</h3>
              <p className="text-body text-ink lg:col-span-5">{row.quote}</p>
              <p className="text-body text-ink-muted lg:col-span-4">{row.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
