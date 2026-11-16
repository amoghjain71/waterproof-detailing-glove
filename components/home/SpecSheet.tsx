import { TrackOnView } from "@/components/providers/TrackOnView";
import { IP } from "@/lib/ip";

const COLUMNS = ["Part", "What it is", "Status"] as const;

/** Customer-facing materials only. No hardness, wall, geometry, or tolerances. */
const ROWS = [
  ["Core", "1 mm closed-cell neoprene", "Target"],
  ["Outer", "Matte-black stretch nylon", "Target"],
  ["Inner", "Smooth polyester tricot", "Target"],
  ["Finished laminate", "1.8 mm or thinner", "Goal"],
  ["Cuff", "60 mm with a soft silicone sealing lip", "Target"],
  ["Strap", "25 mm hook-and-loop that sits under the mitt", "Target"],
  ["Seams", "Sealed seams", "Target"],
  [
    "Size M/L sample",
    "260 mm length, 95 mm palm width, 80 mm middle finger, 60 mm cuff",
    "Sample dimension",
  ],
];

export function SpecSheet() {
  return (
    <section id="spec" className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-surface" aria-hidden />
      <TrackOnView event="view_spec_sheet" targetId="spec" />
      <div className="mx-auto max-w-7xl">
        <h2 data-path-point className="relative z-10 font-display text-h2">
          Spec sheet
        </h2>

        <div className="relative z-10 mt-8 space-y-4 lg:hidden">
          {ROWS.map((row) => (
            <article
              key={row[0]}
              className="border border-rule bg-ground p-4"
            >
              <h3 className="text-label font-medium text-ink">{row[0]}</h3>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="text-label text-ink-muted">{COLUMNS[1]}</dt>
                  <dd className="mt-1 text-body text-ink">{row[1]}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-muted">{COLUMNS[2]}</dt>
                  <dd className="mt-1 text-body text-ink">{row[2]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="relative z-10 mt-8 hidden border border-rule lg:block">
          <div className="mask-edge-x overflow-x-auto">
            <table className="w-full border-collapse text-left text-body">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      className="border-b border-rule px-4 py-3 text-label font-medium text-ink"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell} className="border-b border-rule px-4 py-3 text-ink">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="relative z-10 mt-4 text-label text-ink-muted">
          Prototype V2 development specs. Final values are set after sample testing.
        </p>
        {IP.PATENT_PENDING ? (
          <p className="relative z-10 mt-2 text-label text-ink-muted">
            {IP.NOTICE}
          </p>
        ) : null}
      </div>
    </section>
  );
}
