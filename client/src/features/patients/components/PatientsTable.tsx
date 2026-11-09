import { Pencil, Trash2 } from "lucide-react";
import { Table } from "../../../shared/components/ui/Table";
import { IconButton } from "../../../shared/components/ui/IconButton";
import type { PetSummary } from "../types";
import { PetStatusBadge } from "./PatientStatusBadge";

// Edad compacta: "2 años y 3 meses", "3 meses", etc.
function formatAge(pet: PetSummary): string {
  const parts: string[] = [];
  if (pet.years > 0) {
    parts.push(`${pet.years} ${pet.years === 1 ? "año" : "años"}`);
  }
  if (pet.months > 0 || parts.length === 0) {
    parts.push(`${pet.months} ${pet.months === 1 ? "mes" : "meses"}`);
  }
  return parts.join(" y ");
}

interface PatientsTableProps {
  pets: PetSummary[];
  isLoading: boolean;
  onRowClick: (pet: PetSummary) => void;
  onEdit: (pet: PetSummary) => void;
  onDelete: (pet: PetSummary) => void;
}

export function PatientsTable(
  { pets, isLoading, onRowClick, onEdit, onDelete }: PatientsTableProps,
) {
  return (
    <Table<PetSummary>
      data={pets}
      keyExtractor={(pet) => pet.id}
      onRowClick={onRowClick}
      emptyMessage={isLoading
        ? "Cargando mascotas..."
        : "No se encontraron mascotas."}
      columns={[
        {
          header: "Mascota",
          render: (p) => (
            <span className="font-medium text-slate-800">{p.name}</span>
          ),
        },
        {
          header: "Especie / Raza",
          render: (p) => `${p.specie} · ${p.race}`,
        },
        {
          header: "Edad",
          render: (p) => formatAge(p),
        },
        {
          header: "Estado",
          render: (p) => <PetStatusBadge status={p.status} />,
        },
        {
          header: "",
          className: "w-20",
          render: (p) => (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                icon={Pencil}
                label="Editar"
                onClick={() => onEdit(p)}
              />
              <IconButton
                icon={Trash2}
                label="Eliminar"
                tone="danger"
                onClick={() => onDelete(p)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
