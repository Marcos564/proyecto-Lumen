import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Contrato mínimo que cumplen los services con CRUD para que la UI pueda
 * reutilizar el mismo hook.
 */
export interface CrudService<T, TInput> {
  list: () => Promise<T[]>;
  create: (input: TInput) => Promise<T>;
  update: (id: string, input: TInput) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/**
 * Lista + altas + ediciones + bajas de un recurso, con invalidación de caché
 * automática. Evita repetir el mismo bloque de React Query en cada página.
 */
export function useCrudResource<T, TInput>(
  queryKey: readonly unknown[],
  service: CrudService<T, TInput>,
) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  const query = useQuery({
    queryKey,
    queryFn: service.list,
  });

  const create = useMutation({
    mutationFn: (input: TInput) => service.create(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TInput }) =>
      service.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: invalidate,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    invalidate,
    create,
    update,
    remove,
  };
}
