import Link from "next/link";
import { AutoVideo } from "@/components/media/AutoVideo";
import { TEST_GATES, type TestStatus } from "@/data/tests";

const IDS = ["v01", "v02", "v03", "v04"];

const COPY: Record<string, { name: string; what: string }> = {
  v01: {
    name: "Leak test",
    what: "Fingers under water for 10 minutes with 50 finger flexes and a dry indicator inside.",
  },
  v02: {
    name: "Worn-cuff test",
    what: "10 minutes of water-only washing under a mitt with wrist movement.",
  },
  v03: {
    name: "Flex test",
    what: "1,000 finger cycles and 100 on-and-off cycles.",
  },
  v04: {
    name: "Strap test",
    what: "500 open-and-close cycles, 100 of them wet.",
  },
};

function statusLabel(status: TestStatus) {
  if (status === "in_testing") return "In testing";
  if (status === "passed") return "Passed";
  if (status === "failed") return "Failed";
  return "Planned";
}

export function TestPreview() {
  const rows = IDS.map((id) => TEST_GATES.find((gate) => gate.id === id)).filter(
    (gate): gate is NonNullable<typeof gate> => Boolean(gate),
  );

  return (
    <section className="relative border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative z-10 lg:col-span-7">
          <h2 data-path-point className="font-display text-h2">
            How we test it
          </h2>

          <div className="mt-8 space-y-4 lg:hidden">
            {rows.map((gate) => (
              <article
                key={gate.id}
                className="border border-rule bg-surface p-4"
              >
                <h3 className="text-label font-medium text-ink">
                  {COPY[gate.id]?.name}
                </h3>
                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="text-label text-ink-muted">What we do</dt>
                    <dd className="mt-1 text-body text-ink-muted">
                      {COPY[gate.id]?.what}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-label text-ink-muted">Status</dt>
                    <dd className="mt-1 text-body text-ink">
                      {statusLabel(gate.status)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-8 hidden overflow-x-auto border border-rule lg:block">
            <table className="w-full border-collapse text-left text-body">
              <thead>
                <tr>
                  {["Test", "What we do", "Status"].map((column) => (
                    <th
                      key={column}
                      className="border-b border-rule px-4 py-3 text-label font-medium"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((gate) => (
                  <tr key={gate.id}>
                    <td className="border-b border-rule px-4 py-3">
                      {COPY[gate.id]?.name}
                    </td>
                    <td className="border-b border-rule px-4 py-3 text-ink-muted">
                      {COPY[gate.id]?.what}
                    </td>
                    <td className="border-b border-rule px-4 py-3">
                      {statusLabel(gate.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-body text-ink">
            We publish every result, including failures.
          </p>
          <Link
            href="/tested"
            className="mt-4 inline-flex text-label text-brand"
          >
            See the full test list
          </Link>
        </div>

        <div
          data-path-point
          className="relative z-10 overflow-hidden border border-rule lg:col-span-5"
        >
          <AutoVideo id="making-leak-test" className="aspect-mitt w-full" />
        </div>
      </div>
    </section>
  );
}
