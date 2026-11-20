import axios from "axios";
import { getConfig, tokenKey } from "../index.ts";

const instance = axios.create({
  withCredentials: true,
});


instance.interceptors.request.use(async (config) => {
  const envConfig = await getConfig();

    // ANTES: getUrl() devolvía solamente protocolo, servidor y puerto.
  // Por eso era necesario agregar manualmente "/api/".
  // config.baseURL = `${envConfig.getUrl()}/api/`;

  // AHORA: VITE_API_BASE_URL ya contiene la URL completa,
  // incluyendo "/api/", por lo que no es necesario concatenarla.
  config.baseURL = envConfig.getUrl();

  console.log(
    "axiosInstance.baseURL configurada para esta petición:",
    config.baseURL,
  );

  return config;
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.status === 401) {
      if (location.pathname.includes("/admin/")) {
        localStorage.clear();
        location.href = "/login";
      } else {
        localStorage.removeItem(tokenKey);
      }
    }

    return Promise.reject(error);
  },
);

export { instance };
