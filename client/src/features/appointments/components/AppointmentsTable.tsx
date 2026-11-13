import { Pencil, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { IconButton } from "@shared/components/ui/IconButton";
import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { Appointment, AppointmentStatus } from "@shared/types";
import type { PetSummary } from "@shared/types/pets";
import { AppointmentStatusPopover } from "../AppointmentStatusPopover";

interface AppointmentsTableProps {
  appointments: Appointment[];
  petsById: Map<string, PetSummary>;
  isLoading: boolean;
  updatingId?: string;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onStatusChange: (appointment: Appointment, status: AppointmentStatus) => void;
}

export function AppointmentsTable(
  {
    appointments,
    petsById,
    isLoading,
    updatingId,
    onEdit,
    onDelete,
    onStatusChange,
  }: AppointmentsTableProps,
) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  return (
    <Table<Appointment>
      data={appointments}
      keyExtractor={(appointment) => appointment.id}
      emptyMessage="No hay turnos cargados."
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
              disabled={updatingId === appointment.id}
              onChange={(status) => onStatusChange(appointment, status)}
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
                onClick={() => onEdit(appointment)}
              />
              <IconButton
                icon={Trash2}
                label="Eliminar"
                tone="danger"
                onClick={() => onDelete(appointment)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
