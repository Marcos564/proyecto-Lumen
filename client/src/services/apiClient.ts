import axios from "axios";
import { getConfig } from "../shared/config/configEnv";

// Se conserva el cliente HTTP preparado para la API real.
// La URL se obtiene desde la configuración centralizada,
// evitando definir otro valor predeterminado independiente.

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const envConfig = await getConfig();
  config.baseURL = envConfig.getUrl();
  return config;
});