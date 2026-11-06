export function DataTable({
  columns,
  rows,
}: {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="w-full min-w-0 overflow-x-auto border border-rule">
      <table className="min-w-sheet w-full border-collapse text-left text-body">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-rule bg-surface px-4 py-2 text-label font-medium text-ink"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0] ?? index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${row[0]}-${cellIndex}`}
                  className="border-b border-rule px-4 py-2 text-ink"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
