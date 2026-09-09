import type { ReactNode } from 'react'

interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export function Table<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'Sin resultados.' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto border border-slate-300 bg-white shadow-md ring-1 ring-slate-900/5">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-teal-600">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`odd:bg-white even:bg-slate-50 ${onRowClick ? 'cursor-pointer transition-colors hover:bg-teal-50' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 text-slate-700 ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
