import { FormSkeleton } from "@shared/components/ui/Skeletons";
import { useRaces, useSpecies } from "../hooks/useSpecies";
import { PatientForm, type PatientFormProps } from "./PatientForm";

type PatientFormContainerProps = Omit<PatientFormProps, "species" | "races">;

/**
 * Carga los catálogos del formulario recién cuando el modal se abre.
 *
 * `Modal` no renderiza a sus hijos mientras está cerrado, así que este
 * contenedor (y sus requests de especies/razas) solo se monta al crear o
 * editar una mascota. Así el listado no espera esos catálogos.
 */
export function PatientFormContainer(props: PatientFormContainerProps) {
  const { data: species = [], isLoading: isLoadingSpecies } = useSpecies();
  const { data: races = [], isLoading: isLoadingRaces } = useRaces();

  if (isLoadingSpecies || isLoadingRaces) {
    return <FormSkeleton />;
  }

  return <PatientForm species={species} races={races} {...props} />;
}
