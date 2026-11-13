import type { Owner, OwnerInput, OwnerWithPets } from "../types";
import { createMockStore } from "./mock/createMockStore";
import { ownersMock } from "./mock/owners.mock";

const DNI_REGEX = /^\d{7,8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Quita espacios y deja el DNI solo con dígitos (acepta "30.123.456").
function normalizeOwner(data: OwnerInput): OwnerInput {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dni: data.dni.replace(/\D/g, ""),
    address: data.address.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || undefined,
  };
}

function validateOwner(
  data: OwnerInput,
  { items, currentId }: { items: readonly Owner[]; currentId?: string },
) {
  if (!data.firstName || !data.lastName || !data.address || !data.phone) {
    throw new Error("Nombre, apellido, dirección y teléfono son obligatorios.");
  }
  if (!DNI_REGEX.test(data.dni)) {
    throw new Error("El DNI debe tener 7 u 8 dígitos.");
  }
  if (data.email && !EMAIL_REGEX.test(data.email)) {
    throw new Error("El email no es válido.");
  }
  if (
    items.some((owner) => owner.dni === data.dni && owner.id !== currentId)
  ) {
    throw new Error("Ya existe un responsable con ese DNI.");
  }
}

const store = createMockStore<Owner, OwnerInput>({
  seed: ownersMock,
  normalize: normalizeOwner,
  validate: validateOwner,
  notFoundMessage: "Responsable no encontrado",
});

// Las mascotas viven en el backend y se vinculan al perfil autenticado, no a
// estos responsables; por eso el contador se mantiene en 0.
const withPetCount = (owner: Owner): OwnerWithPets => ({ ...owner, petCount: 0 });

export const ownersService = {
  async list(): Promise<OwnerWithPets[]> {
    return (await store.list()).map(withPetCount);
  },

  async getById(id: string): Promise<OwnerWithPets | undefined> {
    const owner = await store.getById(id);
    return owner ? withPetCount(owner) : undefined;
  },

  async create(data: OwnerInput): Promise<OwnerWithPets> {
    return withPetCount(await store.create(data));
  },

  async update(id: string, data: OwnerInput): Promise<OwnerWithPets> {
    return withPetCount(await store.update(id, data));
  },

  remove: (id: string) => store.remove(id),
};
