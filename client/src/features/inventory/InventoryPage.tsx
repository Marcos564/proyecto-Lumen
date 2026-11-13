import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { IconButton } from "@shared/components/ui/IconButton";
import { Badge } from "@shared/components/ui/Badge";
import { Modal } from "@shared/components/ui/Modal";
import type {
  InventoryCategory,
  InventoryItem,
  InventoryItemInput,
} from "@shared/types";
import { useInventory } from "./hooks/useInventory";
import { InventoryItemForm } from "./InventoryItemForm";

const categoryLabels: Record<InventoryCategory, string> = {
  medication: "Medicamento",
  supply: "Insumo",
  food: "Alimento",
  other: "Otro",
};

export function InventoryPage() {
  const { items, isLoading, create, update, remove } = useInventory();
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [items, search]);

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
  }

  function openCreateModal() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function handleSubmit(values: InventoryItemInput) {
    if (editingItem) {
      update.mutate(
        { id: editingItem.id, data: values },
        { onSuccess: closeModal },
      );
    } else {
      create.mutate(values, { onSuccess: closeModal });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Inventario</h1>
          <p className="text-sm text-slate-500">
            Stock de medicamentos e insumos.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo insumo
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar insumo..."
      />

      <Table<InventoryItem>
        data={filteredItems}
        keyExtractor={(item) => item.id}
        emptyMessage={isLoading
          ? "Cargando inventario..."
          : "No se encontraron insumos."}
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
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label="Eliminar"
                  tone="danger"
                  onClick={() => remove.mutate(item.id)}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        title={editingItem ? "Editar insumo" : "Nuevo insumo"}
        onClose={closeModal}
      >
        <InventoryItemForm
          initialValues={editingItem ?? undefined}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
