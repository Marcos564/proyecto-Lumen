import { getApiErrorMessage } from "./apiError";

/** Extrae `data` de una petición de axios preservando el tipo. */
export async function unwrap<T>(request: Promise<{ data: T }>): Promise<T> {
  return (await request).data;
}

/** Convierte cualquier error de axios en un mensaje legible para la UI. */
export function toApiError(error: unknown): Error {
  return new Error(getApiErrorMessage(error));
}
