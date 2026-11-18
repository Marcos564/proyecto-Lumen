import { Suspense, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { FormSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
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
  const { items: owners, isLoading, create } = useOwners();
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredOwners = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return owners;
    return owners.filter((owner) =>
      ownerFullName(owner).toLowerCase().includes(term),
    );
  }, [owners, search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Responsables"
        description="Responsables de las mascotas atendidas en la clínica."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo responsable
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre..."
      />

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <OwnersTable owners={filteredOwners} isLoading={isLoading} />
      </Suspense>

      <Modal
        open={isModalOpen}
        title="Nuevo responsable"
        onClose={() => setModalOpen(false)}
      >
        <Suspense fallback={<FormSkeleton />}>
          <OwnerForm
            error={create.error?.message}
            submitting={create.isPending}
            onSubmit={(values) =>
              create.mutate(values, {
                onSuccess: () => setModalOpen(false),
              })
            }
          />
        </Suspense>
      </Modal>
    </div>
  );
}
