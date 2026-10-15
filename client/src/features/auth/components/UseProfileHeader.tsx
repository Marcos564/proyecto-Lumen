import { User } from "lucide-react";
import { useAuth } from "../../../shared";

export const UserProfileHeader = () => {
  const { jwtPayload, isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-8">
      <div className="relative">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lumen-50 text-lumen-600 ring-4 ring-lumen-100/60">
          <User className="h-8 w-8" />
        </span>
        <span
          className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${
            isAuthenticated ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
          }`}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          ¡Hola, {user?.fullName || jwtPayload?.unique_name || "Usuario"}!
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          {isAuthenticated
            ? "Acceso concedido. Bienvenido a la plataforma clínica."
            : "Por favor, ingrese sus credenciales de autenticación."}
        </p>
      </div>
    </div>
  );
};
