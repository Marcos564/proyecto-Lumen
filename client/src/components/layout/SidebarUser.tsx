import { useEffect, useRef, useState } from 'react'
import { ChevronUp, LogIn, LogOut, User } from 'lucide-react'

interface SessionUser {
  name: string
  role: string
}

const mockUser: SessionUser = { name: 'Dra. Marina Lopez', role: 'Administradora' }

export function SidebarUser() {
  const [user, setUser] = useState<SessionUser | null>(mockUser)
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div ref={containerRef} className="relative mt-4 border-t border-slate-800 pt-4">
      {menuOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden border border-slate-700 bg-slate-800 py-1 shadow-lg">
          {user ? (
            <button
              type="button"
              onClick={() => {
                setUser(null)
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUser(mockUser)
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-800"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200">
          <User className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">{user ? user.name : 'Invitado'}</span>
          <span className="block truncate text-xs text-slate-400">{user ? user.role : 'Sin sesión iniciada'}</span>
        </span>
        <ChevronUp className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${menuOpen ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
