import type { AppointmentStatus } from "@shared/types";

// El backend deriva el estado de finishedDate, así que solo estos dos estados
// se pueden representar de punta a punta.
export const appointmentStatuses: AppointmentStatus[] = [
  "scheduled",
  "completed",
];

export const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Programado",
  completed: "Completado",
};

export const statusTones: Record<
  AppointmentStatus,
  "success" | "warning" | "danger"
> = {
  scheduled: "warning",
  completed: "success",
};
