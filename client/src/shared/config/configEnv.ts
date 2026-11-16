
export interface Config {
  apiUrl: string;

  // port: string;
  // Se necesitaba el puerto por separado para construir la URL completa.
  // Ahora se utiliza VITE_API_BASE_URL, que contiene la dirección completa,
  // incluyendo el puerto cuando corresponde.

  // http: string;
  // Ya no es necesario porque VITE_API_BASE_URL contiene
  // el protocolo (http o https) y la dirección completa.

  appName: string;
  getUrl: () => string;
}

let cachedConfig: Config | null = null;

export function getConfig(): Promise<Readonly<Config>> {

  // Antes getUrl construía la URL concatenando
  // protocolo, dirección del servidor y puerto.

  // const getUrl = () => {
  //   if (!cachedConfig) {
  //     throw new Error("Config not initialized");
  //   }
  //   return `${cachedConfig.http}://${cachedConfig.apiUrl}:${cachedConfig.port}`;
  // };

  // Ya no es necesario construir la URL manualmente.
  // Se obtiene directamente de VITE_API_BASE_URL.

  if (!cachedConfig) {
    cachedConfig = {

      // Antes se utilizaba VITE_API_URL, que contenía
      // solamente la dirección del servidor.
      // apiUrl: import.meta.env.VITE_API_URL ?? "localhost",

      // Ahora se utiliza una única variable con la URL completa.
      apiUrl:
        import.meta.env.VITE_API_BASE_URL ??
        "http://localhost:8080/api/",

      appName: import.meta.env.VITE_APP_NAME ?? "Lumen",

      // Devuelve directamente la URL base configurada,
      // sin concatenar protocolo, servidor y puerto.
      getUrl: () => cachedConfig!.apiUrl,
    };
  }

  // Se mantiene fuera del if para devolver la configuración
  // tanto si acaba de inicializarse como si ya estaba en caché.
  return Promise.resolve(cachedConfig);
}
