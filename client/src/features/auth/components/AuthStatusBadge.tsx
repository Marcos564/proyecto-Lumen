import { User } from "lucide-react";
import { useAuth } from "../../../shared";

export const AuthStatusBadge = () => {
  const { jwtPayload, isAuthenticated, user } = useAuth();

  return (
    <div className="fixed bottom-4 left-4 z-10 flex items-center gap-3 p-2.5 pr-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-lg text-left transition-all hover:shadow-xl">
      <User className="h-5 w-5" />
      <div className="text-xs">
        <div className="font-bold text-slate-800">
          {user?.fullName || jwtPayload?.sub || "Usuario desconocido"}
        </div>
        <div className="text-slate-500 flex items-center gap-1.5">
          <span>
            {jwtPayload
              ?.[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ]}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span
            className={isAuthenticated
              ? "text-emerald-600 font-semibold"
              : "text-amber-600"}
          >
            {isAuthenticated ? "Autenticado" : "No autenticado"}
          </span>
        </div>
      </div>
    </div>
  );
};
