import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import type { Specialist, SpecialistInput } from "@shared/types";
import { useSpecialists } from "./hooks/useSpecialists";

const SpecialistsTable = lazyComponent(
  "SpecialistsTable",
  () => import("./components/SpecialistsTable"),
);
const SpecialistForm = lazyComponent(
  "SpecialistForm",
  () => import("./SpecialistForm"),
);

export function SpecialistsListPage() {
  const { items, isLoading, create, update, remove } = useSpecialists();
  const [search, setSearch] = useState("");
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(
    null,
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredSpecialists = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((specialist) =>
      specialist.name.toLowerCase().includes(term) ||
      specialist.specialty.toLowerCase().includes(term)
    );
  }, [items, search]);

  function closeModal() {
    setModalOpen(false);
    setEditingSpecialist(null);
  }

  function openCreateModal() {
    setEditingSpecialist(null);
    setModalOpen(true);
  }

  function handleSubmit(values: SpecialistInput) {
    if (editingSpecialist) {
      update.mutate(
        { id: editingSpecialist.id, data: values },
        { onSuccess: closeModal },
      );
    } else {
      create.mutate(values, { onSuccess: closeModal });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Especialistas"
        description="Doctores y especialistas de la clínica."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Nuevo especialista
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o especialidad..."
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
        <SpecialistsTable
          specialists={filteredSpecialists}
          isLoading={isLoading}
          onEdit={(specialist) => {
            setEditingSpecialist(specialist);
            setModalOpen(true);
          }}
          onDelete={(specialist) => remove.mutate(specialist.id)}
        />
      </Suspense>

      <Modal
        open={isModalOpen}
        title={editingSpecialist
          ? "Editar especialista"
          : "Nuevo especialista"}
        onClose={closeModal}
      >
        <Suspense fallback={<FormSkeleton />}>
          <SpecialistForm
            initialValues={editingSpecialist ?? undefined}
            onSubmit={handleSubmit}
            submitting={create.isPending || update.isPending}
          />
        </Suspense>
      </Modal>
    </div>
  );
}
