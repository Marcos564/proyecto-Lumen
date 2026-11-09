import { useState } from "react";
import type { Pet, PetInput, PetUpdateInput } from "../types";
import { useCreatePet, usePet, useUpdatePet } from "./usePets";

/*
 * Estado del modal de alta/edición y envío del formulario.
 * Al crear se manda un RequestCreatePet completo (POST /pets/me); al editar la
 * API solo acepta nombre y estado (PUT /pets/{id}), y el formulario se
 * precarga con el detalle (GET /pets/{id}), que trae especie, raza y sexo.
 */

function petToInput(pet: Pet): PetInput {
  return {
    name: pet.name,
    birthDate: pet.birthDate,
    status: pet.status,
    raceId: pet.raceId,
    gender: pet.gender,
  };
}

export function usePetFormModal() {
  const [isOpen, setOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const isEditing = editingPetId !== null;
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();

  // Detalle completo de la mascota en edición (el listado no trae raceId/gender).
  const editingDetail = usePet(editingPetId ?? undefined);

  function openCreate() {
    setEditingPetId(null);
    setOpen(true);
  }

  // El listado puede abrir la edición con el mínimo (id) disponible.
  function openEdit(pet: { id: string }) {
    setEditingPetId(pet.id);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditingPetId(null);
  }

  function submit(values: PetInput) {
    if (editingPetId) {
      const data: PetUpdateInput = { name: values.name, status: values.status };
      updatePet.mutate({ id: editingPetId, data }, { onSuccess: close });
    } else {
      createPet.mutate(values, { onSuccess: close });
    }
  }

  return {
    isOpen,
    isEditing,
    // undefined mientras no hay nada que precargar o el detalle sigue cargando.
    initialValues: editingPetId
      ? editingDetail.data && petToInput(editingDetail.data)
      : undefined,
    isSubmitting: createPet.isPending || updatePet.isPending,
    isLoadingInitialValues: isEditing && editingDetail.isLoading,
    openCreate,
    openEdit,
    close,
    submit,
  };
}
