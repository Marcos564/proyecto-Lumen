import type { ReactNode } from "react";
import { type LucideIcon, PawPrint, HeartPulse } from "lucide-react";
import { Card } from "@shared/components/ui/Card";
import type { Pet } from "@shared/types/pets";
import { PetStatusBadge } from "./PatientStatusBadge";

interface PatientInfoTabProps {
  patient: Pet;
}

export function PatientInfoTab({ patient }: PatientInfoTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <SectionTitle icon={PawPrint} title="Mascota" />
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Nombre" value={patient.name} />
          <InfoRow label="Especie" value={patient.specie} />
          <InfoRow label="Raza" value={patient.race} />
          <InfoRow
            label="Fecha de nacimiento"
            value={patient.birthDate || "—"}
          />
          <InfoRow
            label="Edad"
            value={formatAge(patient)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle icon={HeartPulse} title="Estado" />
        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            label="Estado"
            value={<PetStatusBadge status={patient.status} />}
          />
          <InfoRow
            label="Sexo"
            value={genderLabel[patient.gender] ?? patient.gender}
          />
        </div>
      </Card>
    </div>
  );
}

const genderLabel: Record<string, string> = {
  Male: "Macho",
  Female: "Hembra",
  Other: "Otro",
};

// Edad compacta a partir del cálculo que ya devuelve el backend.
function formatAge(pet: Pet): string {
  const parts: string[] = [];
  if (pet.years > 0) {
    parts.push(`${pet.years} ${pet.years === 1 ? "año" : "años"}`);
  }
  if (pet.months > 0 || parts.length === 0) {
    parts.push(`${pet.months} ${pet.months === 1 ? "mes" : "meses"}`);
  }
  return parts.join(" y ");
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
