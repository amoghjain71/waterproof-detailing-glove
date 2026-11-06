import { BRAND } from "@/lib/config";

const COLUMNS = [
  "Question",
  "Mitt alone",
  "Nitrile gloves",
  "Thick neoprene",
  `${BRAND.name} glove`,
];

const ROWS = [
  [
    "Water on your hands",
    "A mitt soaks through in seconds",
    "Blocks water, then traps sweat",
    "Blocks water, but the cuff is short and loose",
    "Designed to keep bucket water off your hands",
  ],
  [
    "Under a mitt",
    "This is the mitt",
    "Thin, but it tears in heavy scrubbing",
    "Too bulky to wear under a mitt",
    "Target 1.8 mm or thinner so the mitt still slides on",
  ],
  [
    "Cuff",
    "No seal",
    "Short loose cuff",
    "A tall cuff that does not sit under a mitt",
    "60 mm cuff, silicone lip, 25 mm strap under the mitt",
  ],
  [
    "Swap mid-wash",
    "You swap wet mitts onto a bare hand",
    "The same gloves stay on",
    "Awkward under a mitt",
    "Put the glove on once, then swap mitts over it",
  ],
];

export function CompareSection() {
  return (
    <section className="border-t border-rule px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-h2">Compare</h2>
        <div className="mt-8 w-full min-w-0 overflow-x-auto border border-rule">
          <table className="w-full min-w-sheet border-collapse text-left text-body">
            <thead>
              <tr>
                {COLUMNS.map((column) => (
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
              {ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} className="border-b border-rule px-4 py-3 align-top">
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
  );
}
