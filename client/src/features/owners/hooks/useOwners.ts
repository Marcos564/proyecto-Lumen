import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ownersService } from "@shared/services/owners.service";
import type { OwnerInput } from "@shared/types";

// Claves de caché para responsables. Usarlas siempre desde acá para que las
// invalidaciones coincidan.
export const ownerKeys = {
  all: ["owners"] as const,
  detail: (id: string) => ["owners", id] as const,
};

export function useOwners() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ownerKeys.all,
    queryFn: ownersService.list,
  });

  const create = useMutation({
    mutationFn: (input: OwnerInput) => ownersService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ownerKeys.all }),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    create,
  };
}

export function useOwner(id: string | undefined) {
  return useQuery({
    queryKey: ownerKeys.detail(id ?? ""),
    queryFn: () => ownersService.getById(id as string),
    enabled: Boolean(id),
  });
}
