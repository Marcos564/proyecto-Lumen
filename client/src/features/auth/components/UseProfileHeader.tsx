import { User } from "lucide-react";
import { useAuth } from "../../../shared";

export const UserProfileHeader = () => {
  const { jwtPayload, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-6">
      <div className="relative">
        <User className="lg" />
        <span
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            isAuthenticated ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
          }`}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          ¡Hola, {jwtPayload ? jwtPayload?.unique_name : "Usuario"}!
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
