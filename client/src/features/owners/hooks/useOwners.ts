import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOwnerById,
  getOwners,
  type OwnerWithPets,
} from "../../../services/owners.service";

// Claves de caché de React Query para dueños. Usarlas siempre desde acá
// para que las invalidaciones de otras features (p. ej. pacientes) coincidan.
export const ownerKeys = {
  all: ["owners"] as const,
  detail: (id: string) => ["owners", id] as const,
};

export function useOwners() {
  return useQuery({ queryKey: ownerKeys.all, queryFn: getOwners });
}

export function useOwner(id: string | undefined) {
  return useQuery({
    queryKey: ownerKeys.detail(id ?? ""),
    queryFn: () => getOwnerById(id as string),
    enabled: Boolean(id),
  });
}

// Índice id → dueño para resolver rápido el dueño de cada paciente.
export function useOwnersById(owners: OwnerWithPets[]) {
  return useMemo(
    () => new Map(owners.map((owner) => [owner.id, owner])),
    [owners],
  );
}
