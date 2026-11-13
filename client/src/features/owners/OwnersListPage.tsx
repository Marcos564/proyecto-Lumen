import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import type { OwnerInput, OwnerWithPets } from "@shared/types";
import { useOwners } from "./hooks/useOwners";
import { ownerFullName } from "./ownerFullName";

const OwnersTable = lazyComponent(
  "OwnersTable",
  () => import("./components/OwnersTable"),
);
const OwnerForm = lazyComponent(
  "OwnerForm",
  () => import("./OwnerForm"),
);

export function OwnersListPage() {
  const { items: owners, isLoading, create, update, remove } = useOwners();
  const [search, setSearch] = useState("");
  const [editingOwner, setEditingOwner] = useState<OwnerWithPets | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  function closeModal() {
    setModalOpen(false);
    setEditingOwner(null);
  }

  function openModal(owner: OwnerWithPets | null) {
    create.reset();
    update.reset();
    setEditingOwner(owner);
    setModalOpen(true);
  }

  function handleSubmit(values: OwnerInput) {
    if (editingOwner) {
      update.mutate(
        { id: editingOwner.id, data: values },
        { onSuccess: closeModal },
      );
    } else {
      create.mutate(values, { onSuccess: closeModal });
    }
  }

  const filteredOwners = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return owners;
    const dniTerm = term.replace(/\./g, "");
    return owners.filter((owner) =>
      ownerFullName(owner).toLowerCase().includes(term) ||
      (dniTerm !== "" && owner.dni.includes(dniTerm))
    );
  }, [owners, search]);

  const formError = (create.error ?? update.error)?.message;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Responsables"
        description="Responsables de las mascotas atendidas en la clínica."
        action={
          <Button onClick={() => openModal(null)}>
            <Plus className="h-4 w-4" />
            Nuevo responsable
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o DNI..."
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={7} />}>
        <OwnersTable
          owners={filteredOwners}
          isLoading={isLoading}
          onEdit={openModal}
          onDelete={(owner) =>
            remove.mutate(owner.id, {
              onError: (error) => window.alert(error.message),
            })}
        />
      </Suspense>

      <Modal
        open={isModalOpen}
        title={editingOwner ? "Editar responsable" : "Nuevo responsable"}
        onClose={closeModal}
      >
        <Suspense fallback={<FormSkeleton />}>
          <OwnerForm
            initialValues={editingOwner ?? undefined}
            petCount={editingOwner?.petCount}
            error={formError}
            onSubmit={handleSubmit}
            submitting={create.isPending || update.isPending}
          />
        </Suspense>
      </Modal>
    </div>
  );
}
