import { AutoVideo } from "@/components/media/AutoVideo";
import type { VideoId } from "@/content/videos";

const STEPS: { n: string; title: string; body: string; video: VideoId }[] = [
  {
    n: "1",
    title: "Put it on once",
    body: "Close the cuff. The glove stays on for the whole wash.",
    video: "glove-on-strap",
  },
  {
    n: "2",
    title: "Slide any mitt over it",
    body: "Your mitt still slides on. The strap stays hidden under the cuff.",
    video: "mitt-swap",
  },
  {
    n: "3",
    title: "Swap mitts in the bucket",
    body: "Drop a mitt in the bucket. The glove stays on your hand.",
    video: "full-wash-in-use",
  },
];

export function HowItWorks({
  washVideo = "full-wash-in-use",
}: {
  washVideo?: VideoId;
} = {}) {
  const steps = STEPS.map((step) =>
    step.n === "3" ? { ...step, video: washVideo } : step,
  );

  return (
    <section id="how-it-works" className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 data-path-point className="relative z-10 font-display text-h2">
          How it works
        </h2>
        <ol className="mt-10 grid gap-10 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="relative z-10 font-display text-h3 text-ink">{step.n}</p>
              <h3 className="relative z-10 mt-3 font-display text-h3">{step.title}</h3>
              <p className="relative z-10 mt-3 text-body text-ink-muted">{step.body}</p>
              <div
                data-path-point
                className="mt-4 overflow-hidden border border-rule"
              >
                <AutoVideo id={step.video} className="aspect-mitt w-full" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
