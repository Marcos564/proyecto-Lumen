import { delay } from "./delay";

export type MockStoreMode = "create" | "update";

export interface MockValidationContext<T> {
  /** Estado actual del store, para validaciones que dependen de otros registros. */
  items: readonly T[];
  mode: MockStoreMode;
  /** Id del registro que se está editando (solo en `update`). */
  currentId?: string;
}

export interface MockStoreOptions<T extends { id: string }, TInput> {
  seed: readonly T[];
  /** Normaliza la entrada antes de validarla y guardarla. */
  normalize?: (input: TInput) => TInput;
  /** Lanza un `Error` con un mensaje legible si la entrada no es válida. */
  validate?: (input: TInput, context: MockValidationContext<T>) => void;
  /** Mensaje cuando se intenta editar un registro inexistente. */
  notFoundMessage?: string;
}

export interface MockStore<T, TInput> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(input: TInput): Promise<T>;
  update(id: string, input: TInput): Promise<T>;
  remove(id: string): Promise<void>;
}

const copy = <T>(value: T): T => ({ ...value });

/**
 * Repositorio en memoria para los módulos que todavía no tienen backend.
 *
 * Centraliza el patrón que antes se repetía en cada service (demora
 * simulada, ids, validación y actualización inmutable) para que migrar a HTTP
 * sea reemplazar este store por llamadas a la API.
 */
export function createMockStore<T extends { id: string }, TInput>({
  seed,
  normalize,
  validate,
  notFoundMessage = "Registro no encontrado",
}: MockStoreOptions<T, TInput>): MockStore<T, TInput> {
  let items: T[] = seed.map(copy);

  function prepare(
    input: TInput,
    mode: MockStoreMode,
    currentId?: string,
  ): TInput {
    const value = normalize ? normalize(input) : input;
    validate?.(value, { items, mode, currentId });
    return value;
  }

  return {
    async list() {
      await delay();
      return items.map(copy);
    },

    async getById(id) {
      await delay();
      const item = items.find((current) => current.id === id);
      return item ? copy(item) : undefined;
    },

    async create(input) {
      await delay();
      const value = prepare(input, "create");
      const created = { ...value, id: crypto.randomUUID() } as unknown as T;
      items = [...items, created];
      return copy(created);
    },

    async update(id, input) {
      await delay();
      const value = prepare(input, "update", id);
      const existing = items.find((current) => current.id === id);
      if (!existing) throw new Error(notFoundMessage);
      const updated = { ...existing, ...value, id } as unknown as T;
      items = items.map((current) => (current.id === id ? updated : current));
      return copy(updated);
    },

    async remove(id) {
      await delay();
      items = items.filter((current) => current.id !== id);
    },
  };
}
