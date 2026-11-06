import type { ReactNode } from "react";
import { type LucideIcon, PawPrint, User } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import type { OwnerWithPets } from "../../../services/owners.service";
import type { Patient } from "../../../types";
import { ownerFullName } from "../../owners/ownerFullName";
import { PatientStatusBadge } from "./PatientStatusBadge";

interface PatientInfoTabProps {
  patient: Patient;
  owner: OwnerWithPets | undefined;
}

export function PatientInfoTab({ patient, owner }: PatientInfoTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <SectionTitle icon={PawPrint} title="Mascota" />
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Nombre" value={patient.name} />
          <InfoRow label="Especie" value={patient.species} />
          <InfoRow label="Raza" value={patient.breed} />
          <InfoRow
            label="Fecha de nacimiento"
            value={patient.birthDate || "—"}
          />
          <InfoRow
            label="Estado"
            value={<PatientStatusBadge status={patient.status} />}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle icon={User} title="Dueño" />
        {owner
          ? (
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Nombre" value={ownerFullName(owner)} />
              <InfoRow label="DNI" value={owner.dni} />
              <InfoRow label="Teléfono" value={owner.phone} />
              <InfoRow label="Email" value={owner.email || "—"} />
              <InfoRow label="Dirección" value={owner.address} />
              <InfoRow label="Mascotas registradas" value={owner.petCount} />
            </div>
          )
          : (
            <p className="text-sm text-slate-400">
              Cargando datos del dueño...
            </p>
          )}
      </Card>
    </div>
  );
}

function SectionTitle(
  { icon: Icon, title }: { icon: LucideIcon; title: string },
) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h2>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs tracking-wide text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-slate-700 wrap-anywhere">{value}</span>
    </div>
  );
}
