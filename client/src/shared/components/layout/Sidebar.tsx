import {
  CalendarDays,
  Package,
  PawPrint,
  Stethoscope,
  Users,
} from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { SidebarItem } from "./SidebarItem";
import { SidebarUser } from "./SidebarUser";

const navItems = [
  { to: "/pets", label: "Pacientes", icon: PawPrint },
  { to: "/owners", label: "Responsables", icon: Users },
  { to: "/staff", label: "Especialistas", icon: Stethoscope },
  { to: "/appointments", label: "Turnos", icon: CalendarDays },
  { to: "/stock", label: "Inventario", icon: Package },
];

export function Sidebar() {
  return (
    <aside className="app-sidebar flex h-full w-64 shrink-0 flex-col border-r px-4 py-6">
      <div className="mb-8 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <PawPrint className="h-7 w-7 text-teal-500" />
          <span className="text-lg font-semibold text-slate-800">Lumen</span>
        </div>
        <ThemeToggle />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => <SidebarItem key={item.to} {...item} />)}
      </nav>
      <SidebarUser />
    </aside>
  );
}
