import { useQuery } from "@tanstack/react-query";
import { patientServices } from "../service/patientsService";

export function usePatientsById(id: string) {
    return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => patientServices.getPatients(id),
    enabled: !!id, // Opcional: evita que se ejecute si el id no existe todavía
  });
}
export function getMedicalRecord(id: string, pageSize?: number, pageNumber?: number) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => patientServices.getMedicalRecords(id, pageSize || 10, pageNumber || 1),
    enabled: !!id, // Opcional: evita que se ejecute si el id no existe todavía
  });
}
export function useAllPets(pageSize?: number, pageNumber?: number) {
  return useQuery({
    queryKey: ["allPets"],
    queryFn: async () => patientServices.getAllPets(pageSize || 10, pageNumber || 1),
  });
}