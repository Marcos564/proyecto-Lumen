// Responsable ⇄ `ProfileResponse` del backend
// (LumenBackend.Shared/Dtos/ProfileModel.cs).
//
// La response del API no trae `document` ni `email`, así que no se muestran en
// el listado. `dni` se pide solo al dar de alta (el backend lo requiere como
// `document`).
export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  region: string;
  country: string;
  city: string;
  postalCode: string;
}

/** Datos del formulario de alta; el id lo genera el backend. */
export type OwnerInput = Omit<Owner, "id"> & { dni: string };

/** Responsable con la cantidad de mascotas asignadas (dato derivado). */
export interface OwnerWithPets extends Owner {
  petCount: number;
}
