import type { Appointment, AppointmentInput, AppointmentStatus } from "../../types";
import { toDateTimeValue } from "../../utils/dateTime";
import type {
  AppointmentResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "../dtos";

/*
 * El backend no tiene un campo `status`. Se deriva de `finishedDate`:
 *  - sin fecha de fin (o igual a assignedDate) → "scheduled"
 *  - con fecha de fin → "completed"
 * Por eso la UI solo ofrece esos dos estados.
 */
function isUnsetDate(value: string): boolean {
  return !value || value.startsWith("0001-01-01");
}

function deriveStatus(api: AppointmentResponse): AppointmentStatus {
  if (isUnsetDate(api.finishedDate) || api.finishedDate === api.assignedDate) {
    return "scheduled";
  }
  return "completed";
}

/** AppointmentResponse → Appointment (modelo de la UI). */
export function fromApiAppointment(api: AppointmentResponse): Appointment {
  return {
    id: api.id,
    patientId: api.petId,
    date: toDateTimeValue(new Date(api.assignedDate)),
    reason: api.reason,
    status: deriveStatus(api),
  };
}

function toBody(input: AppointmentInput) {
  const assignedDate = new Date(input.date).toISOString();
  return {
    assignedDate,
    finishedDate:
      input.status === "completed" ? new Date().toISOString() : assignedDate,
    reason: input.reason,
  };
}

/** AppointmentInput → RequestCreateAppointmentModel. */
export function toCreateAppointmentBody(
  input: AppointmentInput,
): CreateAppointmentRequest {
  return { petId: input.patientId, ...toBody(input) };
}

/** AppointmentInput → RequestUpdateAppointmentModel. */
export function toUpdateAppointmentBody(
  input: AppointmentInput,
): UpdateAppointmentRequest {
  return toBody(input);
}
