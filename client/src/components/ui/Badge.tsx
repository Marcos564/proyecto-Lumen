import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-slate-100 text-slate-600',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>{children}</span>
}
