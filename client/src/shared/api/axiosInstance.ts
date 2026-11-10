import axios, { type InternalAxiosRequestConfig } from "axios";
import { getConfig, profileKey, tokenKey } from "../index.ts";

/*
 * Cliente HTTP único de la aplicación.
 *
 * - Configura el `baseURL` a partir de las variables de entorno.
 * - Adjunta el JWT en cada request: `Authorization: Bearer <token>`.
 * - Ante un 401 de una ruta protegida limpia la sesión y manda al login.
 *
 * El token se guarda en `localStorage` con la clave `@lumen:token`
 * (ver `constant/localStorage.ts`).
 */

const LOGIN_PATH = "/auth/login";
// Clave usada por versiones anteriores de la app. Se migra al leerla.

const instance = axios.create({
  // El backend también desafía autenticación por cookie (ASP.NET Identity).
  // `true` permite enviar/recibir esa cookie en requests cross-origin.
  withCredentials: true,
});

// Evita disparar varias redirecciones al login si fallan varias requests a la vez.
let isRedirectingToLogin = false;

/**
 * Devuelve el token guardado, migrando el de versiones viejas si hace falta.
 */
function getStoredToken(): string | null {
  const token = localStorage.getItem(tokenKey);
  if (token) return token;
  return null;
}

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string,
): void {
  // Axios normaliza `headers` a AxiosHeaders antes de los interceptores.
  config.headers.set("Authorization", `Bearer ${token}`);
}

function clearSession(): void {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(profileKey);
}

// Un 401 del propio login son credenciales incorrectas, no una sesión vencida.
function isAuthEndpoint(url?: string): boolean {
  return Boolean(url && /\/auth\//i.test(url));
}

instance.interceptors.request.use(async (config) => {
  const envConfig = await getConfig();
  config.baseURL = `${envConfig.getUrl()}/api/`;

  if (import.meta.env.DEV) {
    console.log("[axios] baseURL:", config.baseURL);
  }

  return config;
});

instance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      setAuthorizationHeader(config, token);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl: string | undefined = error.config?.url;

    if (status === 401 && !isAuthEndpoint(requestUrl)) {
      clearSession();

      if (
        !isRedirectingToLogin &&
        !window.location.pathname.startsWith(LOGIN_PATH)
      ) {
        isRedirectingToLogin = true;
        window.location.assign(LOGIN_PATH);
      }
    }

    return Promise.reject(error);
  },
);

export { instance };
