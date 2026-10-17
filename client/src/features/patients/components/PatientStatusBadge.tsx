import { Badge } from "../../../components/ui/Badge";
import type { PatientStatus } from "../../../types";

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge tone={status === "active" ? "success" : "neutral"}>
      {status === "active" ? "Activo" : "Inactivo"}
    </Badge>
  );
}
