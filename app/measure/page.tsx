import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/commerce/PrintButton";

export const metadata: Metadata = {
  title: "Measuring strip",
  description: "Print a 1:1 strip to check your hand circumference for the 2HANDS glove.",
};

export default function MeasurePage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-h2">Measuring strip</h1>
        <p className="mt-4 text-body text-ink">
          Print at 100% scale. If the box is not 50 mm wide, the printer resized the page.
        </p>
        <div className="measure-box mt-8" aria-label="50 millimeter scale check" />
        <p className="mt-4 text-label text-ink-muted">This box is 50 mm wide.</p>
        <PrintButton />
        <p className="mt-8 max-w-xl text-body text-ink">
          Wrap a tape around the widest knuckles, fingers together, thumb out. Snug, not
          squeezed. 200 to 215 mm is size M. Between sizes, choose the larger.
        </p>
        <Link href="/#sizing" className="mt-8 inline-flex text-label text-brand">
          Back to sizing
        </Link>
      </div>
    </section>
  );
}
