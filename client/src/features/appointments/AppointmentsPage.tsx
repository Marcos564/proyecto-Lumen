import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import { usePets } from "@features/patients/hooks/usePets";
import type { Appointment, AppointmentInput } from "@shared/types";
import { useAppointments } from "./hooks/useAppointments";

// La tabla y el formulario se descargan aparte; la página solo necesita los
// datos y su encabezado para pintar el primer frame.
const AppointmentsTable = lazyComponent(
  "AppointmentsTable",
  () => import("./components/AppointmentsTable"),
);
const AppointmentForm = lazyComponent(
  "AppointmentForm",
  () => import("./AppointmentForm"),
);

export function AppointmentsPage() {
  const {
    items: appointments,
    isLoading,
    create,
    update,
    remove,
    updateStatus,
  } = useAppointments();
  const { data: pets = [] } = usePets();
  const [editingAppointment, setEditingAppointment] = useState<
    Appointment | null
  >(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const petsById = useMemo(
    () => new Map(pets.map((pet) => [pet.id, pet])),
    [pets],
  );

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => a.date.localeCompare(b.date)),
    [appointments],
  );

  function closeModal() {
    setModalOpen(false);
    setEditingAppointment(null);
  }

  function openCreateModal() {
    setEditingAppointment(null);
    setModalOpen(true);
  }

  function handleSubmit(values: AppointmentInput) {
    if (editingAppointment) {
      update.mutate(
        { id: editingAppointment.id, data: values },
        { onSuccess: closeModal },
      );
    } else {
      create.mutate(values, { onSuccess: closeModal });
    }
  }

  const canCreateAppointment = pets.length > 0;
  const formError = (create.error ?? update.error)?.message;
  const updatingId = updateStatus.isPending
    ? updateStatus.variables?.id
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Turnos"
        description="Agenda de turnos de la clínica."
        action={
          <Button onClick={openCreateModal} disabled={!canCreateAppointment}>
            <Plus className="h-4 w-4" />
            Nuevo turno
          </Button>
        }
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
        <AppointmentsTable
          appointments={sortedAppointments}
          petsById={petsById}
          isLoading={isLoading}
          updatingId={updatingId}
          onEdit={(appointment) => {
            setEditingAppointment(appointment);
            setModalOpen(true);
          }}
          onDelete={(appointment) => remove.mutate(appointment.id)}
          onStatusChange={(appointment, status) =>
            updateStatus.mutate({ id: appointment.id, status })}
        />
      </Suspense>

      <Modal
        open={isModalOpen}
        title={editingAppointment ? "Editar turno" : "Nuevo turno"}
        onClose={closeModal}
      >
        <Suspense fallback={<FormSkeleton />}>
          <AppointmentForm
            pets={pets}
            initialValues={editingAppointment ?? undefined}
            error={formError}
            onSubmit={handleSubmit}
            submitting={create.isPending || update.isPending}
          />
        </Suspense>
      </Modal>
    </div>
  );
}
