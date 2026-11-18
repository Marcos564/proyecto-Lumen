import { instance } from "../api/axiosInstance";
import type { ProfileResponse } from "../api/dtos";
import { fromApiProfile, toCreateProfileBody } from "../api/mappers/owners";
import { toApiError, unwrap } from "../api/request";
import type { OwnerInput, OwnerWithPets } from "../types";

/*
 * Responsables ⇄ /api/profiles (LumenBackend.API).
 *
 * - GET  /api/profiles   listado de perfiles
 * - POST /api/profiles   alta
 *
 * El backend no expone PUT ni DELETE /api/profiles/{id}, y el `GET /{id}` solo
 * devuelve { id, fullName }. Por eso la pantalla de responsables es de alta y
 * consulta: no hay acciones de editar/eliminar que no se puedan cumplir.
 */

// La UI todavía no pagina: se pide un lote grande en una sola llamada.
const PAGE_SIZE = 100;

async function listProfiles(): Promise<ProfileResponse[]> {
  return unwrap(
    instance.get<ProfileResponse[]>("profiles", {
      params: { pageNumber: 1, pageSize: PAGE_SIZE },
    }),
  );
}

export const ownersService = {
  async list(): Promise<OwnerWithPets[]> {
    try {
      return (await listProfiles()).map(fromApiProfile);
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getById(id: string): Promise<OwnerWithPets | undefined> {
    try {
      const profile = (await listProfiles()).find((item) => item.id === id);
      return profile ? fromApiProfile(profile) : undefined;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async create(input: OwnerInput): Promise<OwnerWithPets> {
    try {
      const created = await unwrap(
        instance.post<ProfileResponse>("profiles", toCreateProfileBody(input)),
      );
      return fromApiProfile(created);
    } catch (error) {
      throw toApiError(error);
    }
  },
};
