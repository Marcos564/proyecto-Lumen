// Responsable de una mascota. Hoy se resuelve con datos mock porque el
// backend expone perfiles de usuario (`/api/profiles`), no un CRUD de
// responsables de la clínica.
export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  address: string;
  phone: string;
  email?: string;
}

/** Datos que envía el formulario; el id lo genera el servicio. */
export type OwnerInput = Omit<Owner, "id">;

/** Responsable con la cantidad de mascotas asignadas (dato derivado). */
export interface OwnerWithPets extends Owner {
  petCount: number;
}
