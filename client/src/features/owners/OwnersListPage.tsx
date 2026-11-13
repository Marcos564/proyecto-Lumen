import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { IconButton } from "@shared/components/ui/IconButton";
import { Modal } from "@shared/components/ui/Modal";
import type { OwnerInput, OwnerWithPets } from "@shared/types";
import { useOwners } from "./hooks/useOwners";
import { OwnerForm } from "./OwnerForm";
import { ownerFullName } from "./ownerFullName";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Responsables</h1>
          <p className="text-sm text-slate-500">
            Responsables de las mascotas atendidas en la clínica.
          </p>
        </div>
        <Button onClick={() => openModal(null)}>
          <Plus className="h-4 w-4" />
          Nuevo responsable
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o DNI..."
      />

      <Table<OwnerWithPets>
        data={filteredOwners}
        keyExtractor={(owner) => owner.id}
        emptyMessage={isLoading
          ? "Cargando responsables..."
          : "No se encontraron responsables."}
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
                  onClick={() => openModal(owner)}
                />
                <IconButton
                  icon={Trash2}
                  label={owner.petCount > 0
                    ? "No se puede eliminar: tiene mascotas"
                    : "Eliminar"}
                  tone="danger"
                  className="disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={owner.petCount > 0}
                  onClick={() =>
                    remove.mutate(owner.id, {
                      onError: (error) => window.alert(error.message),
                    })}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        title={editingOwner ? "Editar responsable" : "Nuevo responsable"}
        onClose={closeModal}
      >
        <OwnerForm
          initialValues={editingOwner ?? undefined}
          petCount={editingOwner?.petCount}
          error={formError}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
