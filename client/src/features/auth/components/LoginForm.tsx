import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PawIcon,
  type SignInRequest,
} from "../index.ts";
interface LoginFormProps {
  onSubmit: (data: SignInRequest) => void;
  isLoading: boolean;
  onForgotPassword: () => void;
}
export function LoginForm(
  { onSubmit, isLoading, onForgotPassword }: LoginFormProps,
) {
  const [formData, setFormData] = useState<SignInRequest>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
          Correo Electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <MailIcon className="w-5 h-5 text-[#83CFD3]" />
          </div>
          <input
            type="email"
            required
            placeholder="ejemplo@mascota.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#83CFD3] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <LockIcon className="w-5 h-5 text-[#83CFD3]" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#83CFD3] focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center space-x-2 cursor-pointer text-gray-600 font-medium">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })}
            className="rounded text-[#008C99] focus:ring-[#83CFD3] w-4 h-4"
          />
          <span>Recordarme</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[#008C99] font-bold hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#008C99] hover:bg-[#007580] text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-base active:scale-[0.99] disabled:opacity-50"
      >
        {isLoading
          ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )
          : (
            <>
              <span>INICIAR SESIÓN</span>
              <PawIcon className="w-5 h-5 text-white/90" />
            </>
          )}
      </button>
    </form>
  );
}
