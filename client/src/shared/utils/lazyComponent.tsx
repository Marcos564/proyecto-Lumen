import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type AnyComponent = ComponentType<any>;

/**
 * Carga diferida de un componente exportado con nombre.
 *
 * Sirve tanto para páginas (en las rutas) como para bloques internos: tablas,
 * formularios y tabs que solo se necesitan cuando el usuario los abre.
 * Conserva el tipo de props del componente original.
 */
export function lazyComponent<
  K extends string,
  M extends Record<K, AnyComponent>,
>(
  exportName: K,
  loader: () => Promise<M>,
): LazyExoticComponent<M[K]> {
  return lazy(async () => {
    try {
      const module = await loader();
      return { default: module[exportName] };
    } catch (error) {
      console.error(`Error loading ${exportName}:`, error);
      const Fallback: AnyComponent = () => <div>Error loading {exportName}</div>;
      return { default: Fallback as unknown as M[K] };
    }
  });
}
