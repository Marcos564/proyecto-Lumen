import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { petService } from "@shared/services/pets.service";
import type { PetInput, PetUpdateInput } from "@shared/types/pets";

/*
 * Acceso a datos de mascotas. Los componentes solo usan estos hooks, nunca
 * el servicio HTTP directamente.
 */

export const petKeys = {
  all: ["pets"] as const,
  detail: (id: string) => ["pets", id] as const,
  medicalRecords: (id: string) => ["pets", id, "medical-records"] as const,
};

// La feature de responsables ya no calcula cuántas mascotas tiene cada uno:
// el backend vincula cada mascota con el perfil del usuario autenticado.

export function usePets() {
  return useQuery({ queryKey: petKeys.all, queryFn: petService.getPets });
}

export function usePet(id: string | undefined) {
  return useQuery({
    queryKey: petKeys.detail(id ?? ""),
    queryFn: () => petService.getPet(id as string),
    enabled: Boolean(id),
  });
}

export function useMedicalRecords(petId: string | undefined) {
  return useQuery({
    queryKey: petKeys.medicalRecords(petId ?? ""),
    queryFn: () => petService.getMedicalRecords(petId as string),
    enabled: Boolean(petId),
  });
}

function useInvalidatePets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: petKeys.all });
}

export function useCreatePet() {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: (data: PetInput) => petService.createPet(data),
    onSuccess: invalidate,
  });
}

export function useUpdatePet() {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetUpdateInput }) =>
      petService.updatePet(id, data),
    onSuccess: invalidate,
  });
}

export function useDeletePet() {
  const invalidate = useInvalidatePets();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: invalidate,
  });
}
