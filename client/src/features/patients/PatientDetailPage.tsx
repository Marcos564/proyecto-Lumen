import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "../../shared/components/ui/Tabs";
import { usePet, useMedicalRecords } from "./hooks/usePets";
import { PatientInfoTab } from "./components/PatientInfoTab";
import { HistoryTable } from "./components/HistoryTable";
import type { MedicalRecord } from "./types";

const tabs = [
  { id: "info", label: "Info general" },
  { id: "medical-records", label: "Historia clínica" },
];

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const { data: patient, isLoading } = usePet(id);
  const { data: medicalRecords = [], isLoading: isLoadingRecords } =
    useMedicalRecords(patient?.id);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando ficha...</p>;
  }
  if (!patient) {
    return <p className="text-sm text-slate-500">Mascota no encontrada.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          {patient.name}
        </h1>
        <p className="text-sm text-slate-500">
          {patient.specie} · {patient.race}
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && <PatientInfoTab patient={patient} />}

      {activeTab === "medical-records" && (
        <HistoryTable<MedicalRecord>
          rows={medicalRecords}
          emptyMessage={isLoadingRecords
            ? "Cargando historia clínica..."
            : "No hay registros de historia clínica."}
          columns={[
            { header: "Registro", render: (r) => r.title },
            {
              header: "Temperatura",
              render: (r) => `${r.temperature} °C`,
            },
            {
              header: "Peso",
              render: (r) => `${r.weight} kg`,
            },
          ]}
        />
      )}
    </div>
  );
}
