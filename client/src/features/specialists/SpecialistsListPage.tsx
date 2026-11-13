import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@shared/components/ui/Table";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { Button } from "@shared/components/ui/Button";
import { IconButton } from "@shared/components/ui/IconButton";
import { Badge } from "@shared/components/ui/Badge";
import { Modal } from "@shared/components/ui/Modal";
import type { Specialist, SpecialistInput } from "@shared/types";
import { useSpecialists } from "./hooks/useSpecialists";
import { SpecialistForm } from "./SpecialistForm";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Especialistas
          </h1>
          <p className="text-sm text-slate-500">
            Doctores y especialistas de la clínica.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo especialista
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o especialidad..."
      />

      <Table<Specialist>
        data={filteredSpecialists}
        keyExtractor={(specialist) => specialist.id}
        emptyMessage={isLoading
          ? "Cargando especialistas..."
          : "No se encontraron especialistas."}
        columns={[
          {
            header: "Nombre",
            render: (specialist) => (
              <span className="font-medium text-slate-800">
                {specialist.name}
              </span>
            ),
          },
          { header: "Especialidad", render: (specialist) => specialist.specialty },
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
                  onClick={() => {
                    setEditingSpecialist(specialist);
                    setModalOpen(true);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label="Eliminar"
                  tone="danger"
                  onClick={() => remove.mutate(specialist.id)}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        title={editingSpecialist
          ? "Editar especialista"
          : "Nuevo especialista"}
        onClose={closeModal}
      >
        <SpecialistForm
          initialValues={editingSpecialist ?? undefined}
          onSubmit={handleSubmit}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
