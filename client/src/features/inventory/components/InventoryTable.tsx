import { Pencil, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { IconButton } from "@shared/components/ui/IconButton";
import { Badge } from "@shared/components/ui/Badge";
import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { InventoryCategory, InventoryItem } from "@shared/types";

const categoryLabels: Record<InventoryCategory, string> = {
  medication: "Medicamento",
  supply: "Insumo",
  food: "Alimento",
  other: "Otro",
};

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export function InventoryTable(
  { items, isLoading, onEdit, onDelete }: InventoryTableProps,
) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  return (
    <Table<InventoryItem>
      data={items}
      keyExtractor={(item) => item.id}
      emptyMessage="No se encontraron insumos."
      columns={[
        {
          header: "Nombre",
          render: (item) => (
            <span className="font-medium text-slate-800">{item.name}</span>
          ),
        },
        {
          header: "Categoría",
          render: (item) => categoryLabels[item.category],
        },
        { header: "Stock", render: (item) => `${item.stock} ${item.unit}` },
        {
          header: "Mínimo",
          render: (item) => `${item.minStock} ${item.unit}`,
        },
        {
          header: "Estado",
          render: (item) =>
            item.stock <= item.minStock
              ? <Badge tone="danger">Stock bajo</Badge>
              : <Badge tone="success">OK</Badge>,
        },
        {
          header: "",
          className: "w-20",
          render: (item) => (
            <div className="flex items-center gap-1">
              <IconButton
                icon={Pencil}
                label="Editar"
                onClick={() => onEdit(item)}
              />
              <IconButton
                icon={Trash2}
                label="Eliminar"
                tone="danger"
                onClick={() => onDelete(item)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
