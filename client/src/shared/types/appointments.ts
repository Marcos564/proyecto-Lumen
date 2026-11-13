// Turno de la agenda. El backend todavía no expone este recurso, por eso se
// mantiene con datos mock.
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  /** Fecha y hora local en formato `YYYY-MM-DDTHH:mm`. */
  date: string;
  reason: string;
  status: AppointmentStatus;
}

/** Datos que envía el formulario; el id lo genera el servicio. */
export type AppointmentInput = Omit<Appointment, "id">;
