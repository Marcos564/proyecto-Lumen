import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import type { InventoryItem, InventoryItemInput } from "@shared/types";
import { useInventory } from "./hooks/useInventory";

const InventoryTable = lazyComponent(
  "InventoryTable",
  () => import("./components/InventoryTable"),
);
const InventoryItemForm = lazyComponent(
  "InventoryItemForm",
  () => import("./InventoryItemForm"),
);

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
      <PageHeader
        title="Inventario"
        description="Stock de medicamentos e insumos."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Nuevo insumo
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar insumo..."
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
        <InventoryTable
          items={filteredItems}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditingItem(item);
            setModalOpen(true);
          }}
          onDelete={(item) => remove.mutate(item.id)}
        />
      </Suspense>

      <Modal
        open={isModalOpen}
        title={editingItem ? "Editar insumo" : "Nuevo insumo"}
        onClose={closeModal}
      >
        <Suspense fallback={<FormSkeleton />}>
          <InventoryItemForm
            initialValues={editingItem ?? undefined}
            onSubmit={handleSubmit}
            submitting={create.isPending || update.isPending}
          />
        </Suspense>
      </Modal>
    </div>
  );
}
