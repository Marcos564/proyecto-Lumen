import { useQuery } from "@tanstack/react-query";
import { useCrudResource } from "@shared/hooks/useCrudResource";
import { ownersService } from "@shared/services/owners.service";

// Claves de caché para responsables. Usarlas siempre desde acá para que las
// invalidaciones coincidan.
export const ownerKeys = {
  all: ["owners"] as const,
  detail: (id: string) => ["owners", id] as const,
};

export function useOwners() {
  return useCrudResource(ownerKeys.all, ownersService);
}

export function useOwner(id: string | undefined) {
  return useQuery({
    queryKey: ownerKeys.detail(id ?? ""),
    queryFn: () => ownersService.getById(id as string),
    enabled: Boolean(id),
  });
}
