import type { Appointment } from "../../types";

/*
 * Agenda de ejemplo. Las fechas son cercanas a la fecha actual del proyecto
 * para que el listado muestre turnos futuros, completados y cancelados.
 * `patientId` apunta a ids de ejemplo: al conectar pacientes reales del
 * backend, esos ids no coinciden y la tabla muestra el guion de "sin dato".
 */
export const appointmentsMock: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    date: "2026-11-16T09:00",
    reason: "Vacunación anual",
    status: "scheduled",
  },
  {
    id: "a2",
    patientId: "p2",
    date: "2026-11-16T10:30",
    reason: "Chequeo general",
    status: "scheduled",
  },
  {
    id: "a3",
    patientId: "p3",
    date: "2026-11-17T11:00",
    reason: "Limpieza dental",
    status: "scheduled",
  },
  {
    id: "a4",
    patientId: "p4",
    date: "2026-11-18T15:00",
    reason: "Consulta dermatológica",
    status: "scheduled",
  },
  {
    id: "a5",
    patientId: "p1",
    date: "2026-11-19T16:30",
    reason: "Control postoperatorio",
    status: "scheduled",
  },
  {
    id: "a6",
    patientId: "p2",
    date: "2026-11-20T08:30",
    reason: "Extracción de puntos",
    status: "scheduled",
  },
  {
    id: "a7",
    patientId: "p3",
    date: "2026-11-10T13:00",
    reason: "Revisión dental",
    status: "completed",
  },
  {
    id: "a8",
    patientId: "p4",
    date: "2026-11-06T17:00",
    reason: "Consulta por alergia",
    status: "cancelled",
  },
];
