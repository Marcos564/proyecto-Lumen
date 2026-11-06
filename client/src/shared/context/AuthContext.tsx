import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authService,
  type SignInRequest,
  type SignInResponse,
  type User,
} from "../../features/auth/index.ts";
import { jwtDecode } from "jwt-decode";
import { profileKey, tokenKey } from "../constant/localStorage.ts";
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInRequest) => Promise<SignInResponse>;
  signOut: () => void;
  jwtPayload: JwtPayload | null;
  user: User | null;
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

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Estado del token crudo
  const [token, setTokenRaw] = useState<string | null>(() => {
    return localStorage.getItem(tokenKey);
  });
  const [user, setUserRaw] = useState<User | null>(() => {
    const userData = localStorage.getItem(profileKey);
    return userData ? JSON.parse(userData) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(tokenKey) && !!localStorage.getItem(profileKey);
  });
  const setUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem(profileKey, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(profileKey);
    }
    setUserRaw(newUser);
  };
  // 2. Función helper para actualizar el token en localStorage y estado
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(tokenKey, newToken);
    } else {
      localStorage.removeItem(tokenKey);
    }
    setTokenRaw(newToken);
  };

  // 3. SignIn conectado a tu authService
  const signIn = async (
    credentials: SignInRequest,
  ): Promise<SignInResponse> => {
    setIsLoading(true);
    try {
      const data: SignInResponse = await authService.signIn(credentials);
      if (data?.accessToken) {
        setToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
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
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
  };
  
  // 5. Decodificación segura del JWT en tiempo real (evitando useState/useEffect anidados)
  const jwtPayload = useMemo<JwtPayload | null>(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);

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
  // Cerrar sesion de forma automatica si el token es invalido o expirado
  useEffect(() => {
    if (token && !jwtPayload) {
      signOut();
    }
  }, [jwtPayload, token]);
  // 6. Memorizamos el valor del contexto para optimizar rendimiento
  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      signIn,
      signOut,
      user,
      jwtPayload,
    }),
    [isLoading, isAuthenticated, jwtPayload],
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

