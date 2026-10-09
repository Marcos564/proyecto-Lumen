import { createContext, useMemo, useState } from "react";
import {
  authService,
  type SignInRequest,
  type SignInResponse,
} from "../../features/auth/index.ts";
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token"));
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signin = async (credentials: SignInRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const data: SignInResponse = await authService.signIn(credentials);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsLoading(false);
      // Re-lanzamos para que la pantalla/formulario pueda mostrar la alerta o mensaje correspondiente
      throw error;
    }
  };
  const signout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  const value = useMemo(() => ({
    isLoading,
    isAuthenticated,
    signIn: signin,
    signOut: signout,
  }), [isLoading, isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
