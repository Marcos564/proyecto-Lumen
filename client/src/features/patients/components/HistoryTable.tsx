import type { ReactNode } from "react";
import { Card } from "../../../components/ui/Card";

interface HistoryColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

interface HistoryTableProps<T extends { id: string }> {
  rows: T[];
  columns: HistoryColumn<T>[];
  emptyMessage: string;
}

// Tabla simple de la ficha (tratamientos, vacunas). La primera columna se
// muestra destacada y el resto en gris.
export function HistoryTable<T extends { id: string }>(
  { rows, columns, emptyMessage }: HistoryTableProps<T>,
) {
  return (
    <Card>
      {rows.length === 0
        ? <p className="text-sm text-slate-400">{emptyMessage}</p>
        : (
          <div className="overflow-x-auto border border-slate-300">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-teal-600">
                <tr className="text-left">
                  {columns.map((col) => (
                    <th
                      key={col.header}
                      className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr key={row.id} className="odd:bg-white even:bg-slate-50">
                    {columns.map((col, index) => (
                      <td
                        key={col.header}
                        className={`px-4 py-2.5 ${
                          index === 0 ? "text-slate-700" : "text-slate-500"
                        }`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </Card>
  );
}
