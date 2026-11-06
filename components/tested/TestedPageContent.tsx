import { AutoVideo } from "@/components/media/AutoVideo";
import { MediaNote } from "@/components/media/MediaNote";
import { NOT_CLAIMING_YET, TEST_GATES, type TestStatus } from "@/data/tests";

const PLAIN: Record<string, { name: string; what: string }> = {
  v01: {
    name: "Leak test",
    what: "A dry paper indicator sits inside the glove. Fingers go under water for 10 minutes, with 50 finger flexes.",
  },
  v02: {
    name: "Worn-cuff test",
    what: "10 minutes of water-only washing under a mitt, with the wrist moving.",
  },
  v03: {
    name: "Flex test",
    what: "1,000 finger cycles and 100 times on and off. Then the leak test runs again.",
  },
  v04: {
    name: "Strap test",
    what: "500 open-and-close cycles on the strap. 100 of those cycles are wet.",
  },
  v05: {
    name: "Care test",
    what: "10 rinse and air-dry cycles. We measure whether the glove changes size.",
  },
  v06: {
    name: "Chemical test",
    what: "Planned against real detailing products. The product list is not locked, so this is not a chemical claim.",
  },
  v07: {
    name: "Fit test",
    what: "Wear it under real mitts. Pick up a coin, pull a trigger, and take the mitt on and off.",
  },
  v08: {
    name: "Cold-water notes",
    what: "Optional comfort notes in cool water. Not a temperature rating.",
  },
};

function statusLabel(status: TestStatus) {
  if (status === "in_testing") return "In testing";
  if (status === "passed") return "Passed";
  if (status === "failed") return "Failed";
  return "Planned";
}

export function TestedPageContent() {
  return (
    <div>
      <section className="border-b border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-h1">How we test it</h1>
          <p className="mt-4 text-lead text-ink">
            Every test stays on this page, pass or fail. Nothing here is certified.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden border border-rule">
              <AutoVideo id="durability-montage" className="aspect-video w-full" />
            </div>
            <MediaNote />
          </div>
          <div>
            <h2 className="font-display text-h2">Not claimed yet</h2>
            <ul className="mt-6 border-t border-rule">
              {NOT_CLAIMING_YET.map((item) => (
                <li key={item} className="border-b border-rule py-3 text-body text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl min-w-0 overflow-x-auto border border-rule">
          <table className="w-full min-w-sheet border-collapse text-left text-body">
            <thead>
              <tr>
                {["Test", "What we do", "Status", "Code"].map((column) => (
                  <th key={column} className="border-b border-rule px-4 py-3 text-label font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_GATES.map((gate) => (
                <tr key={gate.id}>
                  <td className="border-b border-rule px-4 py-3">{PLAIN[gate.id]?.name ?? gate.name}</td>
                  <td className="border-b border-rule px-4 py-3 text-ink-muted">
                    {PLAIN[gate.id]?.what ?? gate.method}
                  </td>
                  <td className="border-b border-rule px-4 py-3">{statusLabel(gate.status)}</td>
                  <td className="border-b border-rule px-4 py-3 text-label text-ink-muted">
                    {gate.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-7xl text-label text-ink-muted">
          Codes are for our notes. The test name is what matters.
        </p>
      </section>
    </div>
  );
}
