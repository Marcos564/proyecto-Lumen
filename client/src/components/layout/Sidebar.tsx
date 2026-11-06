import {
  CalendarDays,
  Package,
  PawPrint,
  Stethoscope,
  Users,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarUser } from "./SidebarUser";

const navItems = [
  { to: "/pets", label: "Pacientes", icon: PawPrint },
  { to: "/owners", label: "Dueños", icon: Users },
  { to: "/staff", label: "Especialistas", icon: Stethoscope },
  { to: "/appointments", label: "Turnos", icon: CalendarDays },
  { to: "/stock", label: "Inventario", icon: Package },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-900 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <PawPrint className="h-7 w-7 text-teal-400" />
        <span className="text-lg font-semibold text-white">Lumen</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => <SidebarItem key={item.to} {...item} />)}
      </nav>
      <SidebarUser />
    </aside>
  );
}
