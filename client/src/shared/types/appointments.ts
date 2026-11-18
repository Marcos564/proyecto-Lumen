// Turno de la agenda ⇄ `AppointmentResponse` del backend
// (LumenBackend.Shared/Dtos/AppointmentModel.cs).
//
// El backend no tiene un campo `status`: se deriva de `finishedDate`, por eso
// la UI solo maneja "scheduled" y "completed".
export type AppointmentStatus = "scheduled" | "completed";

export interface Appointment {
  id: string;
  /** Id de la mascota (`petId` en el backend). */
  patientId: string;
  /** Fecha y hora local en formato `YYYY-MM-DDTHH:mm` (`assignedDate`). */
  date: string;
  reason: string;
  status: AppointmentStatus;
}

/** Datos que envía el formulario; el id lo genera el backend. */
export type AppointmentInput = Omit<Appointment, "id">;
