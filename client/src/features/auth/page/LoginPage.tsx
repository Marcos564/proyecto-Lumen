import type { JSX } from "react";
import { Card } from "../../../components/ui/Card";
import { LoginForm, type LoginFormData } from "../components/LoginForm";
import { UserProfileHeader } from "../components/UseProfileHeader";
import { Lock } from "lucide-react";
import { AuthStatusBadge } from "../components/AuthStatusBadge";
import { useAuth } from "../../../shared";
import { type SubmitHandler } from "react-hook-form";
import type { SignInRequest } from "../types/authTypes";
import { SignInSuccessMessage } from "../components/SignInSuccessMessage";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
export function LoginPage(): JSX.Element {
  const { signIn, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redirige a otra ruta
    navigate("/pacientes");
  };
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const request: SignInRequest = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await signIn(request);
      if (response?.accessToken) {
        console.log("Inicio de sesión exitoso. Token:", response.accessToken);
      } else {
        console.error("Error en el inicio de sesión. Respuesta:", response);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute right-10 top-10 opacity-[0.03] text-teal-900 pointer-events-none">
        <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      </div>

      <div className="w-full max-w-md z-10 space-y-6 shadow-lg p-6 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl">
        <Card className="p-8 rounded-2xl shadow-lg bg-white/90 backdrop-blur-md border border-slate-200/80">
          <UserProfileHeader />
          {/* Ya no pasamos register ni errors, porque el <Form> los provee internamente */}
          {isAuthenticated
            ? (
              <SignInSuccessMessage>
                <Button variant="primary" onClick={handleLoginSuccess}>
                  Continuar
                </Button>
                <Button variant="primary" onClick={signOut}>
                  Cerrar Sesión
                </Button>
              </SignInSuccessMessage>
            )
            : <LoginForm onSubmit={onSubmit} />}
          <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Conexión cifrada de alta seguridad médica</span>
          </div>
        </Card>
      </div>

      <AuthStatusBadge />
    </div>
  );
}
