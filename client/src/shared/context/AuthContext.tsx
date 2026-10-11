import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  authService,
  type SignInRequest,
  type SignInResponse,
} from "../../features/auth/index.ts";
import { jwtDecode } from "jwt-decode";
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInRequest) => Promise<SignInResponse>;
  signOut: () => void;
  jwtPayload: JwtPayload | null;
}
export interface JwtPayload {
  "sub": string;
  "unique_name": string;
  "jti": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "nbf": number;
  "exp": number;
  "iss": string;
  "aud": string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Estado del token crudo
  const [token, setTokenRaw] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token"));
  });

  // 2. Función helper para actualizar el token en localStorage y estado
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
    setTokenRaw(newToken);
  };

  // 3. SignIn conectado a tu authService
  const signIn = async (
    credentials: SignInRequest,
  ): Promise<SignInResponse> => {
    debugger;
    setIsLoading(true);
    try {
      const data: SignInResponse = await authService.signIn(credentials);
      if (data?.accessToken) {
        setToken(data.accessToken);
      }
      return data;
    } catch (error) {
      // Dejamos isLoading en false y re-lanzamos el error para la vista
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. SignOut
  const signOut = (): void => {
    setToken(null);
  };

  // 5. Decodificación segura del JWT en tiempo real (evitando useState/useEffect anidados)
  const jwtPayload = useMemo<JwtPayload | null>(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Opcional: Validar si expiró el token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        signOut();
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Token inválido", error);
      signOut();
      return null;
    }
  }, [token]);

  // 6. Memorizamos el valor del contexto para optimizar rendimiento
  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      signIn,
      signOut,
      jwtPayload,
    }),
    [isLoading, isAuthenticated, jwtPayload],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
