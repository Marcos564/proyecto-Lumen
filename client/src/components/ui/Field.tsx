import type { ReactNode } from 'react'

export const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500'

interface FieldProps {
  label: string
  children: ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600">
      {label}
      {children}
    </label>
  )
}
