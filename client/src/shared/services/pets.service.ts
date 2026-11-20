import { instance } from "../api/axiosInstance";
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
 * - GET  /api/pets            → lista paginada (ResponsePetMinimun)
 * - GET  /api/pets/{id}       → detalle (ResponsePet)
 * - POST /api/pets/me         → crea la mascota del usuario autenticado
 * - PUT  /api/pets/{id}       → solo nombre y estado (RequestUpdatePet)
 * - DELETE /api/pets/{id}
 * - GET  /api/pets/{id}/medical-records
 * - GET  /api/species, /api/races → catálogos del formulario
 * Los endpoints de escritura requieren el token; el interceptor de `shared`
 * ya lo agrega a cada pedido.
 */

// La UI todavía no pagina: se pide un lote grande de una sola llamada.
const BATCH_SIZE = 10;

// Extrae el mensaje legible que el backend devuelve en los errores.
function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "No se pudo conectar con el servidor. ¿Está encendido el Backend?";
}

async function unwrap<T>(request: Promise<{ data: T }>): Promise<T> {
  return (await request).data;
}

export const petService = {
  async getPets(): Promise<PetSummary[]> {
    try {
      return await unwrap<PetSummary[]>(
        instance.get<PetSummary[]>("pets", {
          params: { pageNumber: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getPet(id: string): Promise<Pet | undefined> {
    try {
      return await unwrap<Pet>(instance.get<Pet>(`pets/${id}`));
    } catch (error: any) {
      // 404 = mascota inexistente: para la ficha es un resultado vacío, no un error.
      if (error?.response?.status === 404) return undefined;
      throw new Error(getErrorMessage(error));
    }
  },

  async createPet(data: PetInput): Promise<string> {
    try {
      // POST /pets/me crea la mascota para el perfil del usuario autenticado.
      const created = await unwrap<{ id: string }>(
        instance.post<{ id: string }>("pets/me", data),
      );
      return created.id;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // La API solo permite editar nombre y estado de una mascota existente.
  async updatePet(id: string, data: PetUpdateInput): Promise<void> {
    try {
      await instance.put(`pets/${id}`, data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deletePet(id: string): Promise<void> {
    try {
      await instance.delete(`pets/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getMedicalRecords(petId: string): Promise<MedicalRecord[]> {
    try {
      return await unwrap<MedicalRecord[]>(
        instance.get<MedicalRecord[]>(`pets/${petId}/medical-records`, {
          params: { page: 1, pageSize: BATCH_SIZE },
        }),
      );
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw new Error(getErrorMessage(error));
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
      throw new Error(getErrorMessage(error));
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
      throw new Error(getErrorMessage(error));
    }
  },
};
