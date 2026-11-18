import { Table } from "@shared/components/ui/Table";
import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { OwnerWithPets } from "@shared/types";
import { ownerFullName } from "../ownerFullName";

interface OwnersTableProps {
  owners: OwnerWithPets[];
  isLoading: boolean;
}

export function OwnersTable({ owners, isLoading }: OwnersTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
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
        { header: "Dirección", render: (owner) => owner.address },
        { header: "Teléfono", render: (owner) => owner.phone },
        {
          header: "Ubicación",
          render: (owner) =>
            [owner.city, owner.country].filter(Boolean).join(", ") || "—",
        },
        { header: "Mascotas", render: (owner) => owner.petCount },
      ]}
    />
  );
}
