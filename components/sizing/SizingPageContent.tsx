import Link from "next/link";
import { AutoVideo } from "@/components/media/AutoVideo";
import { MediaNote } from "@/components/media/MediaNote";
import { SizeFinder } from "@/components/sizing/SizeFinder";
import { Button } from "@/components/ui/Button";
import { SIZE_CHART } from "@/data/sizes";
import { SIZES_CONFIRMED } from "@/lib/config";

const STEPS = [
  "Use a flexible tape, not a stiff ruler.",
  "Bare hand. Fingers together. Thumb out.",
  "Wrap the tape around the widest knuckles.",
  "Snug, not squeezed.",
  "Between sizes, choose the larger one.",
];

export function SizingPageContent() {
  return (
    <div>
      <section className="border-b border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-h1">Sizing</h1>
          <p className="mt-4 text-lead text-ink">
            Measure around the widest knuckles. M is 200 to 215 mm. Size S is not
            available. L and XL are still being set.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden border border-rule">
              <AutoVideo id="sizing-measure" className="aspect-video w-full" />
            </div>
            <MediaNote />
            <ol className="mt-6 border-t border-rule">
              {STEPS.map((step, index) => (
                <li key={step} className="border-b border-rule py-3 text-body text-ink">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
            <Button href="/measure" variant="outline" className="mt-6">
              Print measuring strip
            </Button>
          </div>
          <SizeFinder />
        </div>
      </section>

      <section className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-x-auto border border-rule">
          <table className="w-full border-collapse text-left text-body">
            <thead>
              <tr>
                {["Size", "Hand", "Sample", "Status"].map((column) => (
                  <th key={column} className="border-b border-rule px-4 py-3 text-label font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => {
                const confirmed = SIZES_CONFIRMED && row.status === "confirmed";
                return (
                  <tr key={row.code}>
                    <td className="border-b border-rule px-4 py-3">{row.code}</td>
                    <td className="border-b border-rule px-4 py-3 text-ink-muted">
                      {confirmed && row.circumferenceMm
                        ? `${row.circumferenceMm.min} to ${row.circumferenceMm.max} mm`
                        : row.code === "M"
                          ? "200 to 215 mm"
                          : row.status === "unavailable"
                            ? "Not available"
                            : "Size set finalizing"}
                    </td>
                    <td className="border-b border-rule px-4 py-3 text-ink-muted">
                      {row.code === "M" && row.sample
                        ? `${row.sample.overallLengthMm} mm length, ${row.sample.palmWidthLaidFlatMm} mm palm`
                        : "Not set"}
                    </td>
                    <td className="border-b border-rule px-4 py-3">
                      {row.code === "M"
                        ? "Sample"
                        : row.status === "unavailable"
                          ? "Unavailable"
                          : "Finalizing"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-7xl text-label text-ink-muted">
          Palm width is the glove laid flat, not your hand size.{" "}
          <Link href="/measure" className="text-brand">
            Print a 1:1 strip
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
