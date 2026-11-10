import { Badge } from "@shared/components/ui/Badge";
import type { PetStatus } from "@shared/types/pets";

// Estados que expone el enum Status del backend.
const statusLabel: Record<PetStatus, string> = {
  Alive: "Vivo",
  Dead: "Fallecido",
  Entreatment: "En tratamiento",
  Adopted: "Adoptado",
  Lost: "Perdido",
  Unknown: "Desconocido",
};

const statusTone: Record<PetStatus, "success" | "warning" | "danger" | "neutral">
= {
  Alive: "success",
  Dead: "danger",
  Entreatment: "warning",
  Adopted: "neutral",
  Lost: "warning",
  Unknown: "neutral",
};

export function PetStatusBadge({ status }: { status: PetStatus }) {
  return (
    <Badge tone={statusTone[status]}>
      {statusLabel[status] ?? status}
    </Badge>
  );
}
