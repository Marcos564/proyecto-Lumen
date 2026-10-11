import axios from "axios";
import { getConfig } from "../index.ts";

const instance = axios.create({
  withCredentials: false,
});
instance.interceptors.request.use(async (config) => {
  const envConfig = await getConfig(); // Si es async
  config.baseURL = `${envConfig.getUrl()}/api/`;
  console.log(
    "axiosInstance.baseURL configurada para esta petición:",
    config.baseURL,
  );
  return config;
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  },
);

export { instance };
