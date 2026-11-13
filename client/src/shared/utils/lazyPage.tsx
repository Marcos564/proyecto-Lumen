import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Carga diferida de una página exportada con nombre.
 *
 * Centraliza el `lazy(...).catch(...)` que antes se repetía en cada ruta y
 * mantiene un fallback simple si el chunk no se puede descargar.
 */
export function lazyPage<M, K extends keyof M & string>(
  pageName: K,
  loader: () => Promise<M>,
): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    try {
      const module = await loader();
      return { default: module[pageName] as ComponentType };
    } catch (error) {
      console.error(`Error loading ${pageName}:`, error);
      const Fallback = () => <div>Error loading {pageName}</div>;
      return { default: Fallback };
    }
  });
}
