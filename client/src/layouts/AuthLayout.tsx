import {
  ArrowLeft,
  CalendarDays,
  Lock,
  Package,
  PawPrint,
  Users,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { Link } from "../components/ui/Link";

// Misma foto que el hero de la landing.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80";

const HIGHLIGHTS = [
  { icon: PawPrint, text: "Pacientes y dueños en un solo lugar" },
  { icon: CalendarDays, text: "Agenda de turnos por especialista" },
  { icon: Package, text: "Inventario de medicamentos e insumos" },
  { icon: Users, text: "Acceso por roles para todo tu equipo" },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          light
            ? "bg-white/15 ring-1 ring-white/30"
            : "bg-gradient-to-tr from-lumen-600 to-cyan-500 shadow-lg shadow-lumen-600/30"
        }`}
      >
        <PawPrint className="h-6 w-6 text-white" />
      </span>
      <span className="leading-tight">
        <span
          className={`block text-xl font-black tracking-tight ${
            light ? "text-white" : "text-lumen-dark-800"
          }`}
        >
          Lumen
        </span>
        <span
          className={`block text-[10px] font-medium uppercase tracking-widest ${
            light ? "text-lumen-100" : "text-lumen-600"
          }`}
        >
          CRM veterinario
        </span>
      </span>
    </Link>
  );
}

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Panel de marca (solo en pantallas grandes) */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-lumen-600 via-lumen-700 to-lumen-900 p-12 text-white lg:flex">
        <PawPrint className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rotate-12 text-white/5" />
        <PawPrint className="pointer-events-none absolute bottom-40 left-6 h-24 w-24 -rotate-12 text-white/5" />

        <Logo light />

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            El CRM para tu veterinaria
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-lumen-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={HERO_IMAGE}
          alt="Perro golden retriever sentado"
          className="pointer-events-none absolute -bottom-6 right-10 h-72 w-56 rounded-t-full border-8 border-b-0 border-white/20 object-cover shadow-2xl xl:h-80 xl:w-64"
        />

        <p className="relative z-10 text-xs text-lumen-100/70">
          © {new Date().getFullYear()} Lumen · San Miguel de Tucumán
        </p>
      </aside>

      {/* Columna del formulario */}
      <div className="flex w-full flex-col bg-gradient-to-br from-white via-lumen-50/40 to-cyan-50/30 px-4 py-6 sm:px-6 sm:py-8 lg:w-1/2 lg:px-16">
        <div className="flex items-center justify-between">
          <span className="lg:invisible">
            <Logo />
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-lumen-dark-500 transition-colors hover:text-lumen-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Outlet />
        </main>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5" />
          <span>Conexión cifrada de alta seguridad médica</span>
        </div>
      </div>
    </div>
  );
}
