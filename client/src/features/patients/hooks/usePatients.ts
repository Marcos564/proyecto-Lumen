import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  type PatientInput,
  updatePatient,
} from "../../../services/patients.service";
import { ownerKeys } from "../../owners/hooks/useOwners";

/*
 * Acceso a datos de pacientes. Los componentes solo usan estos hooks, nunca
 * los services directamente. Para conectar el backend alcanza con cambiar
 * services/patients.service.ts (mismas firmas): nada de esta carpeta cambia.
 */

export const patientKeys = {
  all: ["patients"] as const,
  detail: (id: string) => ["patients", id] as const,
};

export function usePatients() {
  return useQuery({ queryKey: patientKeys.all, queryFn: getPatients });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: patientKeys.detail(id ?? ""),
    queryFn: () => getPatientById(id as string),
    enabled: Boolean(id),
  });
}

function useInvalidatePatients() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: patientKeys.all });
    // La cantidad de mascotas de cada dueño depende de los pacientes.
    queryClient.invalidateQueries({ queryKey: ownerKeys.all });
  };
}

export function useCreatePatient() {
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationFn: (data: PatientInput) => createPatient(data),
    onSuccess: invalidate,
  });
}

export function useUpdatePatient() {
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientInput }) =>
      updatePatient(id, data),
    onSuccess: invalidate,
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: invalidate,
  });
}
