import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FallbackLoading } from "./FallbackLoading";

/**
 * Protege las rutas privadas.
 *
 * - Mientras la sesión se está resolviendo muestra el loader, así un refresh
 *   no expulsa al usuario antes de leer el token.
 * - Si no hay sesión, redirige a `/auth/login` con ruta absoluta y guarda el
 *   origen para poder volver después del login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FallbackLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
