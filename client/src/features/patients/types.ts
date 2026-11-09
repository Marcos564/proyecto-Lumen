/*
 * Tipos de mascotas, espejo de los DTOs del backend (LumenBackend.Shared.Dtos).
 * El backend serializa los Guid como ShortGuid (string) y los enums como string
 * (JsonStringEnumConverter), por eso todo id/estado es texto.
 */

export type PetStatus =
  | "Alive"
  | "Dead"
  | "Entreatment"
  | "Adopted"
  | "Lost"
  | "Unknown";

export type PetGender = "Male" | "Female" | "Other";

// GET /api/pets/{id} → ResponsePet
export interface Pet {
  id: string;
  raceId: string;
  race: string;
  specieId: string;
  specie: string;
  name: string;
  years: number;
  months: number;
  birthDate: string;
  status: PetStatus;
  gender: PetGender;
}

// GET /api/pets → ResponsePetMinimun (sin specieId/raceId/gender)
export type PetSummary = Omit<Pet, "raceId" | "specieId" | "gender">;

// GET /api/species → ResponseSpecie
export interface Specie {
  id: string;
  name: string;
}

// GET /api/races → ResponseRaceSpecie (la raza trae su especie)
export interface Race {
  id: string;
  name: string;
  specieId: string;
  specieName: string;
}

// POST /api/pets/me → RequestCreatePet
export interface PetInput {
  name: string;
  birthDate: string;
  status: PetStatus;
  raceId: string;
  gender: PetGender;
}

// PUT /api/pets/{id} → RequestUpdatePet
export interface PetUpdateInput {
  name: string;
  status: PetStatus;
}

// GET /api/pets/{id}/medical-records → ResponseMedicalRecord
export interface MedicalRecord {
  id: string;
  title: string;
  temperature: number;
  weight: number;
}
