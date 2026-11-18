import type { OwnerInput, OwnerWithPets } from "../../types";
import type {
  CreateProfileRequest,
  ProfileResponse,
} from "../dtos";

/*
 * `/api/profiles` es el recurso más cercano a "responsables" que expone el
 * backend. La response no incluye `document` ni `email`, así que esos campos
 * no se muestran en el listado; `document` sí se envía al crear.
 */
export function fromApiProfile(profile: ProfileResponse): OwnerWithPets {
  return {
    id: profile.id,
    firstName: profile.name,
    lastName: profile.surname,
    address: profile.address ?? "",
    phone: profile.numberPhone ?? "",
    region: profile.region ?? "",
    country: profile.country ?? "",
    city: profile.city ?? "",
    postalCode: profile.postalCode ?? "",
    // Las mascotas se vinculan al perfil autenticado, no a este listado.
    petCount: 0,
  };
}

export function toCreateProfileBody(input: OwnerInput): CreateProfileRequest {
  return {
    name: input.firstName,
    surname: input.lastName,
    document: input.dni,
    region: input.region,
    country: input.country,
    city: input.city,
    postalCode: input.postalCode,
    numberPhone: input.phone,
    address: input.address,
  };
}
