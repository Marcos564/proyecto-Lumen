import type { JSX, MouseEvent, ReactNode } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Cloud,
  LayoutGrid,
  Mail,
  MapPin,
  Package,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "../../components/ui/Link";

// Fotos de ejemplo (Unsplash). Reemplazar por imágenes propias en /public cuando las haya.
const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
  productMain:
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  productSide:
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
};

// Datos de contacto de ejemplo: reemplazar por los reales.
const CONTACT = {
  email: "contacto@lumen.app",
  hours: "Soporte de lunes a viernes, 9 a 18 h",
};

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#producto", label: "Producto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#contacto", label: "Contacto" },
];

// Un ítem por módulo del CRM (ver Sidebar).
const FEATURES = [
  {
    icon: PawPrint,
    title: "Pacientes",
    text:
      "Ficha de cada mascota con especie, raza, estado e historia clínica siempre a mano.",
  },
  {
    icon: Users,
    title: "Dueños",
    text:
      "Base de clientes con sus datos de contacto y todas las mascotas asociadas.",
  },
  {
    icon: Stethoscope,
    title: "Especialistas",
    text:
      "Gestioná el equipo de veterinarios de tu clínica y sus especialidades.",
  },
  {
    icon: CalendarDays,
    title: "Turnos",
    text:
      "Agenda de consultas con estados para seguir cada turno de punta a punta.",
  },
  {
    icon: Package,
    title: "Inventario",
    text:
      "Control de medicamentos e insumos para no quedarte sin stock en plena consulta.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso por roles",
    text:
      "Cada usuario entra con su cuenta y ve lo que corresponde a su rol en la clínica.",
  },
];

// Beneficios del producto (no métricas): ajustarlos si se cuenta con datos reales.
const HIGHLIGHTS = [
  { icon: LayoutGrid, value: "5", label: "Módulos integrados" },
  { icon: Cloud, value: "100%", label: "Web, sin instalar nada" },
  { icon: Clock, value: "24/7", label: "Acceso a la información" },
  { icon: ShieldCheck, value: "1", label: "Cuenta por usuario" },
];

const SCROLL_DURATION_MS = 450;

// Scroll suave con duración fija (scroll-behavior de CSS no permite controlarla)
// y compensando la altura del header sticky.
function scrollToHash(event: MouseEvent<HTMLAnchorElement>) {
  const hash = event.currentTarget.hash;
  const target = hash ? document.querySelector<HTMLElement>(hash) : null;
  if (!target) return;
  event.preventDefault();

  const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
  const startY = window.scrollY;
  const endY = hash === "#inicio"
    ? 0
    : target.getBoundingClientRect().top + startY - headerHeight;
  history.replaceState(null, "", hash);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, endY);
    return;
  }

  const startTime = performance.now();
  const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
    window.scrollTo(0, startY + (endY - startY) * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function Paw({ className }: { className: string }) {
  return (
    <PawPrint
      aria-hidden
      className={`pointer-events-none absolute text-lumen-500/10 ${className}`}
    />
  );
}

function CtaLink(
  { to, variant, children }: {
    to: string;
    variant: "solid" | "outline";
    children: ReactNode;
  },
) {
  const styles = variant === "solid"
    ? "bg-lumen-600 text-white shadow-md shadow-lumen-600/25 hover:bg-lumen-700"
    : "border-2 border-lumen-600 text-lumen-700 hover:bg-lumen-50";
  const className =
    `inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${styles}`;

  if (to.startsWith("#") || to.startsWith("mailto:")) {
    return (
      <a
        href={to}
        onClick={to.startsWith("#") ? scrollToHash : undefined}
        className={className}
      >
        {children}
        <ChevronRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span aria-hidden className="flex flex-col gap-1.5">
        <span className="h-0.5 w-5 -rotate-[25deg] rounded bg-lumen-500" />
        <span className="h-0.5 w-6 rounded bg-lumen-500" />
        <span className="h-0.5 w-5 rotate-[25deg] rounded bg-lumen-500" />
      </span>
      <h2 className="text-3xl font-bold text-lumen-dark-900 sm:text-4xl">
        {children}
      </h2>
      <span aria-hidden className="flex flex-col gap-1.5">
        <span className="h-0.5 w-5 rotate-[25deg] rounded bg-lumen-500" />
        <span className="h-0.5 w-6 rounded bg-lumen-500" />
        <span className="h-0.5 w-5 -rotate-[25deg] rounded bg-lumen-500" />
      </span>
    </div>
  );
}

export function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white font-sans text-lumen-dark-700">
      {/* Barra superior */}
      <div className="bg-lumen-dark-800 text-xs text-lumen-dark-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-lumen-400" />
            {CONTACT.email}
          </a>
          <span className="hidden items-center gap-2 sm:flex">
            <Clock className="h-3.5 w-3.5 text-lumen-400" />
            {CONTACT.hours}
          </span>
        </div>
      </div>

      {/* Navegación */}
      <header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <a
            href="#inicio"
            onClick={scrollToHash}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-lumen-600 to-cyan-500 shadow-lg shadow-lumen-600/30">
              <PawPrint className="h-6 w-6 text-white" />
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-black tracking-tight text-lumen-dark-800">
                Lumen
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-lumen-600">
                CRM veterinario
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={scrollToHash}
                className={i === 0
                  ? "border-b-2 border-lumen-500 pb-1 text-lumen-600"
                  : "pb-1 text-lumen-dark-700 transition-colors hover:text-lumen-600"}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#funciones"
              onClick={scrollToHash}
              className="hidden items-center gap-1.5 rounded-lg bg-lumen-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lumen-600 sm:inline-flex"
            >
              Funciones
              <ChevronRight className="h-4 w-4" />
            </a>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-lumen-dark-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lumen-dark-700"
            >
              Iniciar sesión
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="inicio" className="relative overflow-hidden">
          <Paw className="left-4 top-16 h-16 w-16 -rotate-12" />
          <Paw className="left-1/3 bottom-10 h-12 w-12 rotate-12" />
          <Paw className="right-8 top-8 h-14 w-14 rotate-6" />
          <Paw className="right-1/4 top-24 h-10 w-10 -rotate-12" />

          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 md:grid-cols-2 md:pt-16">
            <div className="relative z-10 pb-12 md:pb-20">
              <h1 className="text-4xl font-bold leading-tight text-lumen-dark-900 sm:text-5xl">
                El CRM para
                <span className="block text-lumen-600">tu veterinaria</span>
              </h1>
              <p className="mt-5 max-w-md leading-relaxed text-lumen-dark-500">
                Lumen reúne pacientes, dueños, especialistas, turnos e
                inventario en una sola plataforma, para que tu equipo dedique
                menos tiempo a la administración y más a las mascotas.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaLink to="#funciones" variant="solid">
                  Ver funciones
                </CtaLink>
                <CtaLink to="/auth/login" variant="outline">
                  Iniciar sesión
                </CtaLink>
              </div>
            </div>

            <div className="relative flex justify-center self-end">
              {/* Mancha de fondo */}
              <div className="absolute bottom-0 left-1/2 h-[70%] w-full -translate-x-1/2 rounded-t-[45%] rounded-b-none bg-lumen-600">
                <PawPrint className="absolute left-6 top-1/3 h-8 w-8 text-lumen-dark-800/40" />
                <PawPrint className="absolute left-10 bottom-16 h-7 w-7 text-lumen-dark-800/40" />
                <PawPrint className="absolute right-6 top-1/2 h-8 w-8 text-lumen-dark-800/40" />
              </div>
              {/* Destellos */}
              <span aria-hidden className="absolute left-4 top-1/4 flex flex-col gap-2">
                <span className="h-1 w-6 -rotate-[30deg] rounded bg-lumen-400" />
                <span className="h-1 w-7 rounded bg-lumen-400" />
              </span>
              <span aria-hidden className="absolute right-4 top-1/3 flex flex-col gap-2">
                <span className="h-1 w-6 rotate-[30deg] rounded bg-lumen-400" />
                <span className="h-1 w-7 rounded bg-lumen-400" />
              </span>
              <img
                src={IMAGES.hero}
                alt="Perro golden retriever sentado"
                className="relative z-10 mt-6 h-[400px] w-[72%] rounded-t-full border-8 border-b-0 border-white object-cover shadow-xl transition duration-300 ease-out motion-safe:hover:-translate-y-2 motion-safe:hover:rotate-1 hover:shadow-2xl hover:shadow-lumen-dark-900/30 md:h-[440px]"
              />
            </div>
          </div>
        </section>

        {/* Producto */}
        <section id="producto" className="relative overflow-hidden bg-lumen-50">
          <Paw className="right-1/3 top-12 h-16 w-16 rotate-12" />
          <Paw className="right-10 top-28 h-12 w-12 -rotate-12" />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:min-h-[calc(100svh-7rem)] md:grid-cols-2 md:py-32">
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-4 -top-6 h-24 w-24 rounded-[40%] bg-lumen-600" />
              <img
                src={IMAGES.productMain}
                alt="Perro con buzo amarillo"
                className="relative mt-10 h-64 w-3/5 rounded-2xl border-4 border-white object-cover shadow-xl sm:h-72"
              />
              <img
                src={IMAGES.productSide}
                alt="Gato descansando"
                className="relative h-56 w-2/5 rounded-2xl object-cover shadow-lg sm:h-60"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-lumen-600">
                Por qué Lumen
              </p>
              <h2 className="mt-2 text-3xl font-bold text-lumen-dark-900 sm:text-4xl">
                Tu clínica, en orden
              </h2>
              <p className="mt-6 leading-relaxed text-lumen-dark-500">
                Planillas sueltas, agendas en papel y stock contado a mano hacen
                que la información se pierda entre consulta y consulta. Lumen
                centraliza todo lo que pasa en tu veterinaria.
              </p>
              <p className="mt-4 leading-relaxed text-lumen-dark-500">
                Cada mascota tiene su ficha vinculada a su dueño, cada turno
                queda asignado a un especialista y el inventario se actualiza
                desde el mismo sistema, accesible desde cualquier navegador.
              </p>
            </div>
          </div>
          <div className="h-10 rounded-t-[50%] bg-white" />
        </section>

        {/* Funciones */}
        <section id="funciones" className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle>Todo lo que tu veterinaria necesita</SectionTitle>

          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="relative rounded-2xl border-2 border-lumen-200 bg-white px-6 pb-6 pt-10 transition-shadow hover:shadow-lg hover:shadow-lumen-500/10"
              >
                <span className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-lumen-200 bg-white">
                  <Icon className="h-6 w-6 text-lumen-600" />
                </span>
                <h3 className="text-lg font-semibold text-lumen-700">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-lumen-dark-500">
                  {text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CtaLink to={`mailto:${CONTACT.email}`} variant="outline">
              Contactanos
            </CtaLink>
            <CtaLink to="/auth/login" variant="solid">Ingresar a Lumen</CtaLink>
          </div>
        </section>

        {/* Destacados */}
        <section className="bg-lumen-50">
          <div className="h-10 rounded-b-[50%] bg-white" />
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-16 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-2xl bg-white px-4 py-8 text-center shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lumen-50">
                  <Icon className="h-6 w-6 text-lumen-500" />
                </span>
                <span className="mt-4 text-4xl font-bold text-lumen-dark-800">
                  {value}
                </span>
                <span className="mt-1 text-sm font-medium text-lumen-dark-600">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Contacto / pie */}
      <footer id="contacto" className="bg-lumen-dark-900 text-lumen-dark-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-lumen-400" />
              <span className="text-lg font-semibold text-white">Lumen</span>
            </div>
            <p className="mt-2 text-sm text-lumen-dark-300">
              El CRM para clínicas veterinarias.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 hover:text-white"
            >
              <Mail className="h-4 w-4 text-lumen-400" />
              {CONTACT.email}
            </a>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-lumen-400" />
              {CONTACT.hours}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-lumen-400" />
              San Miguel de Tucumán, Argentina
            </span>
          </div>
        </div>
        <p className="border-t border-lumen-dark-800 py-4 text-center text-xs text-lumen-dark-400">
          © {new Date().getFullYear()} Lumen · CRM para veterinarias
        </p>
      </footer>
    </div>
  );
}
