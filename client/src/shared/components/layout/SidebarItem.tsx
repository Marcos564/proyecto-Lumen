import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarItem({ to, label, icon: Icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}
