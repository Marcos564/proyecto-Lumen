import { useMemo, useState } from "react";
import { Button } from "@shared/components/ui/Button";
import { Field, inputClass } from "@shared/components/ui/Field";
import type { PetGender, PetInput, PetStatus, Race, Specie } from "@shared/types/pets";

interface PatientFormProps {
  species: Specie[];
  races: Race[];
  initialValues?: PetInput;
  submitting?: boolean;
  // En edición la API solo acepta nombre y estado (PUT /pets/{id}).
  isEditing?: boolean;
  onSubmit: (values: PetInput) => void;
}

const genderLabel: Record<PetGender, string> = {
  Male: "Macho",
  Female: "Hembra",
  Other: "Otro",
};

const statusLabel: Record<PetStatus, string> = {
  Alive: "Vivo",
  Dead: "Fallecido",
  Entreatment: "En tratamiento",
  Adopted: "Adoptado",
  Lost: "Perdido",
  Unknown: "Desconocido",
};

const defaultValues: PetInput = {
  name: "",
  birthDate: "",
  status: "Alive",
  raceId: "",
  gender: "Male",
};

export function PatientForm(
  {
    species,
    races,
    initialValues,
    submitting,
    isEditing = false,
    onSubmit,
  }: PatientFormProps,
) {
  const [values, setValues] = useState<PetInput>(
    initialValues ?? defaultValues,
  );

  // La especie se elige primero; las razas se filtran por ella.
  // En edición se deduce de la raza que ya tiene la mascota.
  const raceById = useMemo(
    () => new Map(races.map((race) => [race.id, race])),
    [races],
  );
  const [selectedSpecieId, setSelectedSpecieId] = useState(
    () => (initialValues
      ? raceById.get(initialValues.raceId)?.specieId ?? ""
      : ""),
  );
  const racesOfSpecie = useMemo(
    () => races.filter((race) => race.specieId === selectedSpecieId),
    [races, selectedSpecieId],
  );

  function handleChange<K extends keyof PetInput>(
    field: K,
    value: PetInput[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSpecieChange(specieId: string) {
    setSelectedSpecieId(specieId);
    // La raza elegida anteriormente ya no corresponde a la nueva especie.
    setValues((prev) => ({ ...prev, raceId: "" }));
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre (Mascota)">
          <input
            className={inputClass}
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </Field>
        <Field label="Especie">
          <select
            className={inputClass}
            value={selectedSpecieId}
            disabled={isEditing}
            onChange={(e) => handleSpecieChange(e.target.value)}
            required={!isEditing}
          >
            <option value="" disabled>
              Seleccioná una especie
            </option>
            {species.map((specie) => (
              <option key={specie.id} value={specie.id}>
                {specie.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Raza">
          <select
            className={inputClass}
            value={values.raceId}
            disabled={isEditing}
            onChange={(e) => handleChange("raceId", e.target.value)}
            required={!isEditing}
          >
            <option value="" disabled>
              {selectedSpecieId
                ? "Seleccioná una raza"
                : "Elegí una especie primero"}
            </option>
            {racesOfSpecie.map((race) => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha de nacimiento">
          <input
            type="date"
            className={inputClass}
            value={values.birthDate}
            disabled={isEditing}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            required={!isEditing}
          />
        </Field>
        <Field label="Sexo">
          <select
            className={inputClass}
            value={values.gender}
            disabled={isEditing}
            onChange={(e) =>
              handleChange("gender", e.target.value as PetGender)}
            required={!isEditing}
          >
            <option value="" disabled>
              Seleccioná el sexo
            </option>
            {(Object.keys(genderLabel) as PetGender[]).map((gender) => (
              <option key={gender} value={gender}>
                {genderLabel[gender]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={values.status}
            onChange={(e) => handleChange("status", e.target.value as PetStatus)}
          >
            {(Object.keys(statusLabel) as PetStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {isEditing && (
        <p className="text-xs text-slate-400">
          Al editar una mascota existente solo se actualizan el nombre y el
          estado.
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
