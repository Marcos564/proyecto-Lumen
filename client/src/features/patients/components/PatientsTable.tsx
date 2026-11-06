import { Pencil, Trash2 } from "lucide-react";
import { Table } from "../../../components/ui/Table";
import { IconButton } from "../../../components/ui/IconButton";
import type { Owner, Patient } from "../../../types";
import { ownerFullName } from "../../owners/ownerFullName";
import { PatientStatusBadge } from "./PatientStatusBadge";

interface PatientsTableProps {
  patients: Patient[];
  ownersById: Map<string, Owner>;
  isLoading: boolean;
  onRowClick: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientsTable(
  { patients, ownersById, isLoading, onRowClick, onEdit, onDelete }:
    PatientsTableProps,
) {
  return (
    <Table<Patient>
      data={patients}
      keyExtractor={(patient) => patient.id}
      onRowClick={onRowClick}
      emptyMessage={isLoading
        ? "Cargando pacientes..."
        : "No se encontraron pacientes."}
      columns={[
        {
          header: "Mascota",
          render: (p) => (
            <span className="font-medium text-slate-800">{p.name}</span>
          ),
        },
        {
          header: "Especie / Raza",
          render: (p) => `${p.species} · ${p.breed}`,
        },
        {
          header: "Dueño",
          render: (p) => {
            const owner = ownersById.get(p.ownerId);
            return owner ? ownerFullName(owner) : "—";
          },
        },
        {
          header: "Contacto",
          render: (p) => ownersById.get(p.ownerId)?.phone ?? "—",
        },
        {
          header: "Estado",
          render: (p) => <PatientStatusBadge status={p.status} />,
        },
        {
          header: "",
          className: "w-20",
          render: (p) => (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                icon={Pencil}
                label="Editar"
                onClick={() => onEdit(p)}
              />
              <IconButton
                icon={Trash2}
                label="Eliminar"
                tone="danger"
                onClick={() => onDelete(p)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
