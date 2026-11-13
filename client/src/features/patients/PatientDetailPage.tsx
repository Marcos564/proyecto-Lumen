import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "@shared/components/ui/Tabs";
import { PageHeader } from "@shared/components/ui/PageHeader";
import { Skeleton } from "@shared/components/ui/Skeleton";
import { CardsSkeleton, TableSkeleton } from "@shared/components/ui/Skeletons";
import { lazyComponent } from "@shared/utils/lazyComponent";
import { usePet } from "./hooks/usePets";

// Tabs diferidas: la info se pide al abrir la ficha y la historia clínica
// recién cuando el usuario entra a esa tab.
const PatientInfoTab = lazyComponent(
  "PatientInfoTab",
  () => import("./components/PatientInfoTab"),
);
const MedicalHistoryTab = lazyComponent(
  "MedicalHistoryTab",
  () => import("./components/MedicalHistoryTab"),
);

const tabs = [
  { id: "info", label: "Info general" },
  { id: "medical-records", label: "Historia clínica" },
];

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const { data: patient, isLoading } = usePet(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <CardsSkeleton />
      </div>
    );
  }

  if (!patient) {
    return <p className="text-sm text-slate-500">Mascota no encontrada.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={patient.name}
        description={`${patient.specie} · ${patient.race}`}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && (
        <Suspense fallback={<CardsSkeleton />}>
          <PatientInfoTab patient={patient} />
        </Suspense>
      )}

      {activeTab === "medical-records" && (
        <Suspense fallback={<TableSkeleton rows={4} columns={3} />}>
          <MedicalHistoryTab petId={patient.id} />
        </Suspense>
      )}
    </div>
  );
}
