import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useOwners, useOwnersById } from "../owners/hooks/useOwners";
import { useDeletePatient, usePatients } from "./hooks/usePatients";
import { usePatientSearch } from "./hooks/usePatientSearch";
import { usePatientFormModal } from "./hooks/usePatientFormModal";
import { PatientsTable } from "./components/PatientsTable";
import { PatientForm } from "./components/PatientForm";

export function PatientsListPage() {
  const navigate = useNavigate();
  const { data: patients = [], isLoading } = usePatients();
  const { data: owners = [] } = useOwners();
  const ownersById = useOwnersById(owners);
  const { search, setSearch, filteredPatients } = usePatientSearch(
    patients,
    ownersById,
  );
  const formModal = usePatientFormModal();
  const deletePatient = useDeletePatient();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Pacientes</h1>
          <p className="text-sm text-slate-500">
            Listado de mascotas registradas en la clínica.
          </p>
        </div>
        <Button onClick={formModal.openCreate} disabled={owners.length === 0}>
          <Plus className="h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por paciente, dueño o DNI..."
      />

      <PatientsTable
        patients={filteredPatients}
        ownersById={ownersById}
        isLoading={isLoading}
        onRowClick={(patient) => navigate(`/pacientes/${patient.id}`)}
        onEdit={formModal.openEdit}
        onDelete={(patient) => deletePatient.mutate(patient.id)}
      />

      <Modal
        open={formModal.isOpen}
        title={formModal.isEditing ? "Editar paciente" : "Nuevo paciente"}
        onClose={formModal.close}
      >
        <PatientForm
          owners={owners}
          initialValues={formModal.initialValues}
          onSubmit={formModal.submit}
          submitting={formModal.isSubmitting}
        />
      </Modal>
    </div>
  );
}
