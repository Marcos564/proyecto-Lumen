import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../shared";
import { Button } from "../../../components/ui/Button";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Asegúrate de tener este paquete instalado
import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormData>;
}

export function LoginForm({ onSubmit }: LoginFormProps): React.ReactElement {
  const { isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Inicializamos useForm y el validador de Zod aquí mismo de forma unificada
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div>
      {/* El saludo lo muestra UserProfileHeader; acá va solo el formulario. */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo de Correo Electrónico */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Correo Electrónico
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email")}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-gray-800 transition-all"
            />
          </div>
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block ml-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Campo de Contraseña */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Contraseña
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-gray-800 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 mt-1 block ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Botón de Envío */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
        >
          {isLoading ? <span>Cargando...</span> : (
            <>
              <span>Confirmar Acceso</span>
              <span>→</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
