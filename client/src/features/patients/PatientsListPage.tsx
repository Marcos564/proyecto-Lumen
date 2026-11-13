import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import { useDeletePet, usePets } from "./hooks/usePets";
import { usePetSearch } from "./hooks/usePetSearch";
import { usePetFormModal } from "./hooks/usePetFormModal";

// La tabla y el formulario viven en chunks aparte: el listado pinta su
// encabezado y buscador al instante mientras llegan.
const PatientsTable = lazyComponent(
  "PatientsTable",
  () => import("./components/PatientsTable"),
);
const PatientFormContainer = lazyComponent(
  "PatientFormContainer",
  () => import("./components/PatientFormContainer"),
);

export function PatientsListPage() {
  const navigate = useNavigate();
  const { data: pets = [], isLoading } = usePets();
  const { search, setSearch, filteredPets } = usePetSearch(pets);
  const formModal = usePetFormModal();
  const deletePet = useDeletePet();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mascotas"
        description="Listado de mascotas registradas en la clínica."
        action={
          <Button onClick={formModal.openCreate}>
            <Plus className="h-4 w-4" />
            Nueva mascota
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por mascota, especie o raza..."
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <PatientsTable
          pets={filteredPets}
          isLoading={isLoading}
          onRowClick={(pet) => navigate(`/pets/${pet.id}`)}
          onEdit={formModal.openEdit}
          onDelete={(pet) => deletePet.mutate(pet.id)}
        />
      </Suspense>

      <Modal
        open={formModal.isOpen}
        title={formModal.isEditing ? "Editar mascota" : "Nueva mascota"}
        onClose={formModal.close}
      >
        <Suspense fallback={<FormSkeleton />}>
          {/* La key reinicia el formulario cuando llega el detalle a editar. */}
          <PatientFormContainer
            key={formModal.initialValues ? "loaded" : "empty"}
            initialValues={formModal.initialValues}
            onSubmit={formModal.submit}
            submitting={
              formModal.isSubmitting || formModal.isLoadingInitialValues
            }
            isEditing={formModal.isEditing}
          />
        </Suspense>
      </Modal>
    </div>
  );
}
