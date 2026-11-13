import { Pencil, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { IconButton } from "@shared/components/ui/IconButton";
import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { OwnerWithPets } from "@shared/types";
import { ownerFullName } from "../ownerFullName";

interface OwnersTableProps {
  owners: OwnerWithPets[];
  isLoading: boolean;
  onEdit: (owner: OwnerWithPets) => void;
  onDelete: (owner: OwnerWithPets) => void;
}

export function OwnersTable(
  { owners, isLoading, onEdit, onDelete }: OwnersTableProps,
) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  return (
    <Table<OwnerWithPets>
      data={owners}
      keyExtractor={(owner) => owner.id}
      emptyMessage="No se encontraron responsables."
      columns={[
        {
          header: "Nombre",
          render: (owner) => (
            <span className="font-medium text-slate-800">
              {ownerFullName(owner)}
            </span>
          ),
        },
        { header: "DNI", render: (owner) => owner.dni },
        { header: "Dirección", render: (owner) => owner.address },
        { header: "Teléfono", render: (owner) => owner.phone },
        { header: "Email", render: (owner) => owner.email || "—" },
        { header: "Mascotas", render: (owner) => owner.petCount },
        {
          header: "",
          className: "w-20",
          render: (owner) => (
            <div className="flex items-center gap-1">
              <IconButton
                icon={Pencil}
                label="Editar"
                onClick={() => onEdit(owner)}
              />
              <IconButton
                icon={Trash2}
                label={owner.petCount > 0
                  ? "No se puede eliminar: tiene mascotas"
                  : "Eliminar"}
                tone="danger"
                className="disabled:cursor-not-allowed disabled:opacity-40"
                disabled={owner.petCount > 0}
                onClick={() => onDelete(owner)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
