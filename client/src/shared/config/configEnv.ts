/**
 * Configuración del frontend. Una sola variable, una sola fuente de verdad:
 *
 *   VITE_API_URL=https://api.lumen-soft.app
 *
 * Antes se armaba la URL con host + puerto + protocolo por separado y además
 * existía un `public/config.json` que nadie leía (y apuntaba a localhost).
 */
export interface Config {
  apiUrl: string;
  appName: string;
  getUrl: () => string;
}

let cachedConfig: Config | null = null;

export function getConfig(): Promise<Readonly<Config>> {
  if (!cachedConfig) {
    const apiUrl = (
      import.meta.env.VITE_API_URL ?? "https://api.lumen-soft.app"
    ).replace(/\/+$/, "");

    cachedConfig = {
      apiUrl,
      appName: import.meta.env.VITE_APP_NAME ?? "Lumen",
      getUrl: () => apiUrl,
    };
  }
  return Promise.resolve(cachedConfig);
}
