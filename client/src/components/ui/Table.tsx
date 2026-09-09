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
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 text-left font-medium text-slate-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={keyExtractor(row)} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}>
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
