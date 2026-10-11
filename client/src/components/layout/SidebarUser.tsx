import { useEffect, useRef, useState } from "react";
import { ChevronUp, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../../shared";
import { Button } from "../ui/Button";
import { Link } from "../ui/Link";

export function SidebarUser() {
  const { isAuthenticated, signOut, jwtPayload } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      ref={containerRef}
      className="relative mt-4 border-t border-slate-800 pt-4"
    >
      {menuOpen && (
        <div className="group flex flex-col gap-0.5 absolute rounded-xl bottom-full left-0 right-0 mb-2 overflow-hidden border border-slate-700 bg-slate-800">
          {isAuthenticated
            ? (
              <Button
                type="button"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="rounded-none w-full items-center text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            )
            : (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  className="rounded-none w-full items-center text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  <Link
                    to="/auth/login"
                    className="text-slate-200 hover:text-white"
                  >
                    Registrarse
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  className="rounded-none w-full items-center text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  <Link
                    to="/auth/login"
                    className="text-slate-200 hover:text-white"
                  >
                    Iniciar sesión
                  </Link>
                </Button>
              </>
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
          <span className="block truncate text-sm font-medium text-white">
            {jwtPayload ? jwtPayload.unique_name : "Invitado"}
          </span>
          <span className="block truncate text-xs text-slate-400">
            {jwtPayload
              ? jwtPayload
                ?.[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ]
              : "Sin sesión iniciada"}
          </span>
        </span>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            menuOpen ? "" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}
