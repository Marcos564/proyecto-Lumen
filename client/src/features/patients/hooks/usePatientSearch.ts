import { useMemo, useState } from "react";
import type { Owner, Patient } from "../../../types";
import { ownerFullName } from "../../owners/ownerFullName";

// Filtra por nombre de la mascota, nombre del dueño o DNI del dueño.
export function filterPatients(
  patients: Patient[],
  ownersById: Map<string, Owner>,
  search: string,
): Patient[] {
  const term = search.trim().toLowerCase();
  if (!term) return patients;
  return patients.filter((patient) => {
    const owner = ownersById.get(patient.ownerId);
    return (
      patient.name.toLowerCase().includes(term) ||
      (owner !== undefined &&
        (ownerFullName(owner).toLowerCase().includes(term) ||
          owner.dni.includes(term)))
    );
  });
}

export function usePatientSearch(
  patients: Patient[],
  ownersById: Map<string, Owner>,
) {
  const [search, setSearch] = useState("");
  const filteredPatients = useMemo(
    () => filterPatients(patients, ownersById, search),
    [patients, ownersById, search],
  );
  return { search, setSearch, filteredPatients };
}
