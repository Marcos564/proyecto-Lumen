import { isAxiosError } from "axios";
import { instance } from "@shared/api/axiosInstance";
import type { AppointmentResponse } from "@shared/api/dtos";
import {
  fromApiAppointment,
  toCreateAppointmentBody,
  toUpdateAppointmentBody,
} from "@shared/api/mappers/appointments";
import { toApiError, unwrap } from "@shared/api/request";
import type { Appointment, AppointmentInput, AppointmentStatus } from "@shared/types";

/*
 * Acceso HTTP a /api/appointment (LumenBackend.API).
 *
 * - GET    /api/appointment       lista (AppointmentResponse[])
 * - GET    /api/appointment/{id}  detalle
 * - POST   /api/appointment       alta
 * - PUT    /api/appointment/{id}  edición (204, sin cuerpo)
 * - DELETE /api/appointment/{id}  baja (204, sin cuerpo)
 *
 * El servicio vive dentro de la feature para que Turnos sea dueño de su acceso
 * a datos. El estado se deriva de `finishedDate` (ver api/mappers/appointments.ts).
 */

// La UI todavía no pagina: se pide un lote grande en una sola llamada.
const PAGE_SIZE = 100;

function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

async function getApiAppointment(id: string): Promise<AppointmentResponse> {
  return unwrap(instance.get<AppointmentResponse>(`appointment/${id}`));
}

export const appointmentsService = {
  async list(): Promise<Appointment[]> {
    try {
      const api = await unwrap(
        instance.get<AppointmentResponse[]>("appointment", {
          params: { pageNumber: 1, pageSize: PAGE_SIZE },
        }),
      );
      return api.map(fromApiAppointment);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getById(id: string): Promise<Appointment | undefined> {
    try {
      return fromApiAppointment(await getApiAppointment(id));
    } catch (error) {
      if (isNotFound(error)) return undefined;
      throw toApiError(error);
    }
  },

  async create(input: AppointmentInput): Promise<void> {
    try {
      // El POST no devuelve id: la query se recarga desde el backend.
      await instance.post("appointment", toCreateAppointmentBody(input));
    } catch (error) {
      throw toApiError(error);
    }
  },

  async update(id: string, input: AppointmentInput): Promise<void> {
    try {
      await instance.put(`appointment/${id}`, toUpdateAppointmentBody(input));
    } catch (error) {
      throw toApiError(error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await instance.delete(`appointment/${id}`);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    try {
      const current = await getApiAppointment(id);
      const finishedDate =
        status === "completed" ? new Date().toISOString() : current.assignedDate;

      await instance.put(`appointment/${id}`, {
        assignedDate: current.assignedDate,
        finishedDate,
        reason: current.reason,
      });

      return fromApiAppointment({ ...current, finishedDate });
    } catch (error) {
      throw toApiError(error);
    }
  },
};
