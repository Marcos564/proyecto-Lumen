import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import type { AppointmentStatus } from '../../types'
import { appointmentStatuses, statusLabels, statusTones } from './appointmentStatus'

const MENU_HEIGHT = 140

interface AppointmentStatusPopoverProps {
  status: AppointmentStatus
  disabled?: boolean
  onChange: (status: AppointmentStatus) => void
}

export function AppointmentStatusPopover({ status, disabled, onChange }: AppointmentStatusPopoverProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number; openUp: boolean } | null>(null)

  const isOpen = position !== null

  useEffect(() => {
    if (!isOpen) return

    function close() {
      setPosition(null)
    }
    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      close()
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [isOpen])

  function toggle() {
    if (isOpen) {
      setPosition(null)
      return
    }
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight
    setPosition({ top: openUp ? rect.top - 4 : rect.bottom + 4, left: rect.left, openUp })
  }

  function select(next: AppointmentStatus) {
    setPosition(null)
    if (next !== status) onChange(next)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title="Cambiar estado"
        className="inline-flex items-center gap-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-wait disabled:opacity-60"
      >
        <Badge tone={statusTones[status]}>
          {statusLabels[status]}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Badge>
      </button>

      {position && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: position.top, left: position.left }}
          className={`fixed z-50 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ${position.openUp ? '-translate-y-full' : ''}`}
        >
          <p className="px-2 py-1 text-xs font-medium tracking-wide text-slate-400 uppercase">Cambiar estado</p>
          {appointmentStatuses.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === status}
              onClick={() => select(option)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-slate-100"
            >
              <Badge tone={statusTones[option]}>{statusLabels[option]}</Badge>
              {option === status && <Check className="h-4 w-4 text-teal-600" />}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
