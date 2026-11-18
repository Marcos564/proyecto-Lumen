import { useQuery } from "@tanstack/react-query";
import { petsService } from "@shared/services/petsService";

// Catálogos para el formulario de mascotas: especies y razas vienen del backend.
export function useSpecies() {
  return useQuery({
    queryKey: ["species"],
    queryFn: petsService.getSpecies,
    staleTime: 1000 * 60 * 10,
  });
}

export function useRaces() {
  return useQuery({
    queryKey: ["races"],
    queryFn: petsService.getRaces,
    staleTime: 1000 * 60 * 10,
  });
}
