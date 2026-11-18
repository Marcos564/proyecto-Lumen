/**
 * Espejo manual de los DTOs de LumenBackend (LumenBackend.Shared/Dtos/*.cs).
 *
 * Se mantienen a mano, igual que los tipos de `shared/types`, para no atar el
 * frontend a ninguna herramienta ni a la publicación del Swagger.
 *
 * Convenciones del backend:
 *  - Guid se serializa como ShortGuid (string).
 *  - DateTime/DateOnly llegan como string ISO.
 *  - Enums se serializan como string.
 */

// ---------- Appointment ----------

export interface CreateAppointmentRequest {
  petId: string;
  assignedDate: string;
  finishedDate: string;
  reason: string;
}

export interface UpdateAppointmentRequest {
  assignedDate: string;
  finishedDate: string;
  reason: string;
}

export interface AppointmentResponse {
  id: string;
  petId: string;
  assignedDate: string;
  finishedDate: string;
  reason: string;
}

// ---------- Profile ----------

export interface CreateProfileRequest {
  name: string;
  surname: string;
  document: string;
  region: string;
  country: string;
  city: string;
  postalCode: string;
  numberPhone?: string;
  address?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  region?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  numberPhone?: string;
  address?: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  surname: string;
  region: string;
  country: string;
  city: string;
  postalCode: string;
  numberPhone?: string | null;
  address?: string | null;
}

// ---------- Medical records ----------

export interface CreateMedicalRecordRequest {
  title: string;
  observation: string;
  temperature: number;
  weight: number;
  petId: string;
}

export interface MedicalRecordResponse {
  id: string;
  title: string;
  temperature: number;
  weight: number;
}
