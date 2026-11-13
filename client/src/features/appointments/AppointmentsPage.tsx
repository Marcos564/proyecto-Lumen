import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { Button } from "@shared/components/ui/Button";
import { IconButton } from "@shared/components/ui/IconButton";
import { Modal } from "@shared/components/ui/Modal";
import { usePets } from "@features/patients/hooks/usePets";
import type { Appointment, AppointmentInput } from "@shared/types";
import { useAppointments } from "./hooks/useAppointments";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentStatusPopover } from "./AppointmentStatusPopover";

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

  const petsById = useMemo(() => new Map(pets.map((pet) => [pet.id, pet])), [
    pets,
  ]);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Turnos</h1>
          <p className="text-sm text-slate-500">
            Agenda de turnos de la clínica.
          </p>
        </div>
        <Button onClick={openCreateModal} disabled={!canCreateAppointment}>
          <Plus className="h-4 w-4" />
          Nuevo turno
        </Button>
      </div>

      <Table<Appointment>
        data={sortedAppointments}
        keyExtractor={(appointment) => appointment.id}
        emptyMessage={isLoading
          ? "Cargando turnos..."
          : "No hay turnos cargados."}
        columns={[
          {
            header: "Fecha",
            render: (appointment) =>
              new Date(appointment.date).toLocaleDateString("es-AR", {
                dateStyle: "short",
              }),
          },
          {
            header: "Hora",
            render: (appointment) =>
              new Date(appointment.date).toLocaleTimeString("es-AR", {
                timeStyle: "short",
                hourCycle: "h23",
              }),
          },
          {
            header: "Paciente",
            render: (appointment) =>
              petsById.get(appointment.patientId)?.name ?? "—",
          },
          { header: "Motivo", render: (appointment) => appointment.reason },
          {
            header: "Estado",
            render: (appointment) => (
              <AppointmentStatusPopover
                status={appointment.status}
                disabled={updateStatus.isPending &&
                  updateStatus.variables?.id === appointment.id}
                onChange={(status) =>
                  updateStatus.mutate({ id: appointment.id, status })}
              />
            ),
          },
          {
            header: "",
            className: "w-20",
            render: (appointment) => (
              <div className="flex items-center gap-1">
                <IconButton
                  icon={Pencil}
                  label="Editar"
                  onClick={() => {
                    setEditingAppointment(appointment);
                    setModalOpen(true);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label="Eliminar"
                  tone="danger"
                  onClick={() => remove.mutate(appointment.id)}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        title={editingAppointment ? "Editar turno" : "Nuevo turno"}
        onClose={closeModal}
      >
        <AppointmentForm
          pets={pets}
          initialValues={editingAppointment ?? undefined}
          error={formError}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
