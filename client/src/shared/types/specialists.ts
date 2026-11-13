// Profesional de la clínica. El backend todavía no expone este recurso, por
// eso se mantiene con datos mock.
export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  active: boolean;
}

/** Datos que envía el formulario; el id lo genera el servicio. */
export type SpecialistInput = Omit<Specialist, "id">;
