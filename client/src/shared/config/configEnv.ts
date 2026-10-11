export interface Config {
  apiUrl: string;
  port: string;
  http: string;
  appName: string;
  getUrl: () => string;
}
let cachedConfig: Config | null = null;

export function getConfig(): Promise<Readonly<Config>> {
  const getUrl = () => {
    if (!cachedConfig) {
      throw new Error("Config not initialized");
    }
    return `${cachedConfig.http}://${cachedConfig.apiUrl}:${cachedConfig.port}`;
  };
  if (!cachedConfig) {
    cachedConfig = {
      port: import.meta.env.VITE_API_PORT ?? "8080",
      http: import.meta.env.VITE_HTTPS === "true" ? "https" : "http",
      apiUrl: import.meta.env.VITE_API_URL ?? "localhost",
      appName: import.meta.env.VITE_APP_NAME ?? "Lumen",
      getUrl: getUrl,
    };
  }
  return Promise.resolve(cachedConfig);
}
