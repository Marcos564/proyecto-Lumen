type Config = {
  apiUrl: string;
  appName: string;
};

let config: Config = {
  apiUrl: "",
  appName: "",
};

// Función para cargar la configuración por HTTP antes de usar la app
export const loadConfig = async (): Promise<Config> => {
  const response = await fetch("./config.json");
  config = await response.json();
  return config;
};

// Getter para acceder a la configuración cargada
export const getConfig = () => config;
