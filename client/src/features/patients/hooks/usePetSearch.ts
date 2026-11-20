import { useMemo, useState } from "react";
import type { PetSummary } from "@shared/types/pets";

// Filtra por nombre de la mascota, especie o raza. El backend no asocia la
// mascota con un responsable, así que ya no se filtra por dueño.
export function filterPets(
  pets: PetSummary[],
  search: string,
): PetSummary[] {
  const term = search.trim().toLowerCase();
  if (!term) return pets;
  return pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(term) ||
      pet.specie.toLowerCase().includes(term) ||
      pet.race.toLowerCase().includes(term),
  );
}

export function usePetSearch(pets: PetSummary[]) {
  const [search, setSearch] = useState("");
  const filteredPets = useMemo(
    () => filterPets(pets, search),
    [pets, search],
  );
  return { search, setSearch, filteredPets };
}
