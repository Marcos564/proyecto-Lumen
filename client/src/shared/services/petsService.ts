import { isAxiosError } from "axios";
import { instance } from "../api/axiosInstance";
import { toApiError, unwrap } from "../api/request";
import type {
  MedicalRecord,
  Pet,
  PetInput,
  PetSummary,
  PetUpdateInput,
  Race,
  Specie,
} from "../types/pets";

/*
 * Acceso HTTP a mascotas del backend LumenBackend (C# / ASP.NET Core).
 *
 * - GET    /pets                        lista paginada (ResponsePetMinimun)
 * - GET    /pets/{id}                   detalle (ResponsePet)
 * - POST   /pets/me                     crea la mascota del usuario autenticado
 * - PUT    /pets/{id}                   solo nombre y estado (RequestUpdatePet)
 * - DELETE /pets/{id}
 * - GET    /pets/{id}/medical-records
 * - GET    /species, /races             catálogos del formulario
 *
 * Los endpoints de escritura requieren token; el interceptor de `shared` ya lo
 * agrega a cada pedido.
 */

// La UI todavía no pagina: se pide un lote de una sola llamada.
const BATCH_SIZE = 10;

function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

export const petsService = {
  async getPets(): Promise<PetSummary[]> {
    try {
      return await unwrap<PetSummary[]>(
        instance.get<PetSummary[]>("pets", {
          params: { pageNumber: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getPet(id: string): Promise<Pet | undefined> {
    try {
      return await unwrap<Pet>(instance.get<Pet>(`pets/${id}`));
    } catch (error) {
      // 404 = mascota inexistente: para la ficha es un resultado vacío.
      if (isNotFound(error)) return undefined;
      throw toApiError(error);
    }
  },

  async createPet(data: PetInput): Promise<string> {
    try {
      const created = await unwrap<{ id: string }>(
        instance.post<{ id: string }>("pets/me", data),
      );
      return created.id;
    } catch (error) {
      throw toApiError(error);
    }
  },

  // La API solo permite editar nombre y estado de una mascota existente.
  async updatePet(id: string, data: PetUpdateInput): Promise<void> {
    try {
      await instance.put(`pets/${id}`, data);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async deletePet(id: string): Promise<void> {
    try {
      await instance.delete(`pets/${id}`);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getMedicalRecords(petId: string): Promise<MedicalRecord[]> {
    try {
      return await unwrap<MedicalRecord[]>(
        instance.get<MedicalRecord[]>(`pets/${petId}/medical-records`, {
          params: { page: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error) {
      if (isNotFound(error)) return [];
      throw toApiError(error);
    }
  },

  async getSpecies(): Promise<Specie[]> {
    try {
      return await unwrap<Specie[]>(
        instance.get<Specie[]>("species", {
          params: { pageNumber: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getRaces(): Promise<Race[]> {
    try {
      return await unwrap<Race[]>(
        instance.get<Race[]>("races", {
          params: { pageNumber: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error) {
      throw toApiError(error);
    }
  },
};
