import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
}

export function IconButton({ icon: Icon, label, tone = 'default', className = '', ...props }: IconButtonProps) {
  const toneClasses = tone === 'danger' ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'

  return (
    <button aria-label={label} title={label} className={`rounded-lg p-1.5 transition-colors ${toneClasses} ${className}`} {...props}>
      <Icon className="h-4 w-4" />
    </button>
  )
}
