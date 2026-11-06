import { useState } from "react";
import type { PatientInput } from "../../../services/patients.service";
import type { Patient } from "../../../types";
import { useCreatePatient, useUpdatePatient } from "./usePatients";

// Solo los campos editables: no se mandan tratamientos ni vacunas al guardar.
function toPatientInput(patient: Patient): PatientInput {
  const { name, species, breed, birthDate, ownerId, status } = patient;
  return { name, species, breed, birthDate, ownerId, status };
}

// Estado del modal de alta/edición y envío del formulario.
export function usePatientFormModal() {
  const [isOpen, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  function openCreate() {
    setEditingPatient(null);
    setOpen(true);
  }

  function openEdit(patient: Patient) {
    setEditingPatient(patient);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditingPatient(null);
  }

  function submit(values: PatientInput) {
    if (editingPatient) {
      updatePatient.mutate(
        { id: editingPatient.id, data: values },
        { onSuccess: close },
      );
    } else {
      createPatient.mutate(values, { onSuccess: close });
    }
  }

  return {
    isOpen,
    isEditing: editingPatient !== null,
    initialValues: editingPatient ? toPatientInput(editingPatient) : undefined,
    isSubmitting: createPatient.isPending || updatePatient.isPending,
    openCreate,
    openEdit,
    close,
    submit,
  };
}
