import type { Appointment, AppointmentInput, AppointmentStatus } from "../types";
import { isPastDateTime } from "../utils/dateTime";
import { appointmentsMock } from "./mock/appointments.mock";
import { createMockStore } from "./mock/createMockStore";

// Fecha y hora en formato 24 h: YYYY-MM-DDTHH:mm (00:00 a 23:59).
const DATE_TIME_24H = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/;

const VALID_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

function assertValidDate(date: string) {
  if (!DATE_TIME_24H.test(date)) {
    throw new Error(`Invalid appointment date: ${date}`);
  }
}

const store = createMockStore<Appointment, AppointmentInput>({
  seed: appointmentsMock,
  validate: (data, { mode }) => {
    assertValidDate(data.date);
    // Al editar no se restringe: los turnos pasados tienen que poder corregirse.
    if (mode === "create" && isPastDateTime(data.date)) {
      throw new Error(
        "No se puede agendar un turno en una fecha u hora que ya pasó.",
      );
    }
  },
  notFoundMessage: "Turno no encontrado",
});

export const appointmentsService = {
  list: () => store.list(),

  create: (data: AppointmentInput) => store.create(data),

  update: (id: string, data: AppointmentInput) => store.update(id, data),

  remove: (id: string) => store.remove(id),

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Invalid appointment status: ${status}`);
    }

    const current = await store.getById(id);
    if (!current) throw new Error("Turno no encontrado");

    // El store solo actualiza los campos del input; conservamos el resto.
    return store.update(id, {
      patientId: current.patientId,
      date: current.date,
      reason: current.reason,
      status,
    });
  },
};
