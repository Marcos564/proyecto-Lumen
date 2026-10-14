import type { JSX } from "react";
import { Card } from "../../../components/ui/Card";
import { LoginForm, type LoginFormData } from "../components/LoginForm";
import { UserProfileHeader } from "../components/UseProfileHeader";
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

  // El layout (AuthLayout) ya aporta fondo, ancho y el aviso de conexión cifrada.
  return (
    <>
      <Card className="rounded-2xl border-slate-200/80 p-6 shadow-xl shadow-lumen-900/5 sm:p-10">
        <UserProfileHeader />
        {isAuthenticated
          ? (
            <SignInSuccessMessage>
              <Button
                variant="primary"
                className="py-3"
                onClick={handleLoginSuccess}
              >
                Continuar
              </Button>
              <Button variant="secondary" className="py-3" onClick={signOut}>
                Cerrar Sesión
              </Button>
            </SignInSuccessMessage>
          )
          : <LoginForm onSubmit={onSubmit} />}
      </Card>

      {isAuthenticated && <AuthStatusBadge />}
    </>
  );
}
