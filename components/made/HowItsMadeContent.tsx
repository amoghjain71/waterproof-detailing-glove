import { AutoVideo } from "@/components/media/AutoVideo";
import { MediaNote } from "@/components/media/MediaNote";
import { copy } from "@/content/copy";

const MATERIALS = [
  ["Outer", "Matte black stretch nylon", "The shell. No grip dots."],
  ["Core", "1.0 mm closed-cell neoprene", "Designed to keep water off your skin."],
  ["Inner", "Smooth polyester tricot", "Smooth against the hand so the glove goes on and comes off."],
  ["Cuff", "Soft silicone lip", "Closes the wrist. Designed to, still in test."],
  ["Strap", "25 mm hook-and-loop", "Holds the cuff. Sits under the mitt."],
];

export function HowItsMadeContent() {
  return (
    <div>
      <section className="border-b border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-h1">How it is made</h1>
          <p className="mt-4 text-lead text-ink">
            Three layers, cut as a left and a right, then bonded and sealed. The cuff
            lip and strap go on last.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-h2">Materials</h2>
          <div className="mt-8 overflow-x-auto border border-rule">
            <table className="w-full table-fixed border-collapse text-left text-body">
              <thead>
                <tr>
                  {["Layer", "Material", "What it does"].map((column) => (
                    <th key={column} className="border-b border-rule px-4 py-3 text-label font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell} className="border-b border-rule px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-h2">Steps</h2>
          <MediaNote />
          <ol className="mt-10 grid gap-10">
            {copy.makingSteps.map((step, index) => (
              <li key={step.title} className="grid items-center gap-6 lg:grid-cols-2">
                <div>
                  <p className="font-display text-h3">{index + 1}</p>
                  <h3 className="mt-3 font-display text-h3">{step.title}</h3>
                  <p className="mt-3 text-body text-ink-muted">
                    {step.title === "Inspect laminate"
                      ? "Check the sheet before it is cut."
                      : step.title === "Cut mirrored left / right"
                        ? "Cut a left and a right so the pair matches."
                        : step.title === "Bond the body"
                          ? "Join the panels. Keep the seams thin."
                          : step.title === "Seal every joint"
                            ? "Seal the seams. That is where water gets in."
                            : step.title === "Attach lip and strap"
                              ? "Add the silicone lip and the 25 mm strap."
                              : step.title === "Finish"
                                ? "Trim, look it over, and pair left with right."
                                : "Cure it, then run the leak check."}
                  </p>
                </div>
                <div className="overflow-hidden border border-rule">
                  <AutoVideo id={step.video} className="aspect-mitt w-full" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
