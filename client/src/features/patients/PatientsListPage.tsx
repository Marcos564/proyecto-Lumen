import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { useSpecies, useRaces } from "./hooks/useSpecies";
import { useDeletePet, usePets } from "./hooks/usePets";
import { usePetSearch } from "./hooks/usePetSearch";
import { usePetFormModal } from "./hooks/usePetFormModal";
import { PatientsTable } from "./components/PatientsTable";
import { PatientForm } from "./components/PatientForm";

export function PatientsListPage() {
  const navigate = useNavigate();
  const { data: pets = [], isLoading } = usePets();
  const { data: species = [] } = useSpecies();
  const { data: races = [] } = useRaces();
  const { search, setSearch, filteredPets } = usePetSearch(pets);
  const formModal = usePetFormModal();
  const deletePet = useDeletePet();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Mascotas</h1>
          <p className="text-sm text-slate-500">
            Listado de mascotas registradas en la clínica.
          </p>
        </div>
        <Button onClick={formModal.openCreate}>
          <Plus className="h-4 w-4" />
          Nueva mascota
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por mascota, especie o raza..."
      />

      <PatientsTable
        pets={filteredPets}
        isLoading={isLoading}
        onRowClick={(pet) => navigate(`/pets/${pet.id}`)}
        onEdit={formModal.openEdit}
        onDelete={(pet) => deletePet.mutate(pet.id)}
      />

      <Modal
        open={formModal.isOpen}
        title={formModal.isEditing ? "Editar mascota" : "Nueva mascota"}
        onClose={formModal.close}
      >
        {/* La key reinicia el formulario cuando llega el detalle a editar. */}
        <PatientForm
          key={formModal.initialValues ? "loaded" : "empty"}
          species={species}
          races={races}
          initialValues={formModal.initialValues}
          onSubmit={formModal.submit}
          submitting={
            formModal.isSubmitting || formModal.isLoadingInitialValues
          }
          isEditing={formModal.isEditing}
        />
      </Modal>
    </div>
  );
}
