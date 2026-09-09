import { PawPrint, Stethoscope, CalendarDays, Package } from 'lucide-react'
import { SidebarItem } from './SidebarItem'

const navItems = [
  { to: '/pacientes', label: 'Pacientes', icon: PawPrint },
  { to: '/especialistas', label: 'Especialistas', icon: Stethoscope },
  { to: '/turnos', label: 'Turnos', icon: CalendarDays },
  { to: '/inventario', label: 'Inventario', icon: Package },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-900 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <PawPrint className="h-7 w-7 text-teal-400" />
        <span className="text-lg font-semibold text-white">VetCRM</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  )
}
