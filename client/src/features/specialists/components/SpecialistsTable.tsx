import { Pencil, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { IconButton } from "@shared/components/ui/IconButton";
import { Badge } from "@shared/components/ui/Badge";
import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { Specialist } from "@shared/types";

interface SpecialistsTableProps {
  specialists: Specialist[];
  isLoading: boolean;
  onEdit: (specialist: Specialist) => void;
  onDelete: (specialist: Specialist) => void;
}

export function SpecialistsTable(
  { specialists, isLoading, onEdit, onDelete }: SpecialistsTableProps,
) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <Table<Specialist>
      data={specialists}
      keyExtractor={(specialist) => specialist.id}
      emptyMessage="No se encontraron especialistas."
      columns={[
        {
          header: "Nombre",
          render: (specialist) => (
            <span className="font-medium text-slate-800">
              {specialist.name}
            </span>
          ),
        },
        {
          header: "Especialidad",
          render: (specialist) => specialist.specialty,
        },
        { header: "Email", render: (specialist) => specialist.email || "—" },
        { header: "Teléfono", render: (specialist) => specialist.phone || "—" },
        {
          header: "Estado",
          render: (specialist) => (
            <Badge tone={specialist.active ? "success" : "neutral"}>
              {specialist.active ? "Activo" : "Inactivo"}
            </Badge>
          ),
        },
        {
          header: "",
          className: "w-20",
          render: (specialist) => (
            <div className="flex items-center gap-1">
              <IconButton
                icon={Pencil}
                label="Editar"
                onClick={() => onEdit(specialist)}
              />
              <IconButton
                icon={Trash2}
                label="Eliminar"
                tone="danger"
                onClick={() => onDelete(specialist)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
