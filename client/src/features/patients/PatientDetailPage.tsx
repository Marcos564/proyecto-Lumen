import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "../../components/ui/Tabs";
import type { Treatment, Vaccine } from "../../types";
import { ownerFullName } from "../owners/ownerFullName";
import { useOwner } from "../owners/hooks/useOwners";
import { usePatient } from "./hooks/usePatients";
import { PatientInfoTab } from "./components/PatientInfoTab";
import { HistoryTable } from "./components/HistoryTable";

const tabs = [
  { id: "info", label: "Info general" },
  { id: "treatments", label: "Tratamientos" },
  { id: "vaccines", label: "Vacunas" },
];

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const { data: patient, isLoading } = usePatient(id);
  const { data: owner } = useOwner(patient?.ownerId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando ficha...</p>;
  }
  if (!patient) {
    return <p className="text-sm text-slate-500">Paciente no encontrado.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          {patient.name}
        </h1>
        <p className="text-sm text-slate-500">
          {patient.species} · {patient.breed} · Dueño:{" "}
          {owner ? ownerFullName(owner) : "—"}
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && <PatientInfoTab patient={patient} owner={owner} />}

      {activeTab === "treatments" && (
        <HistoryTable<Treatment>
          rows={patient.treatments}
          emptyMessage="Sin tratamientos registrados."
          columns={[
            { header: "Tratamiento", render: (t) => t.name },
            { header: "Fecha", render: (t) => t.date },
            { header: "Notas", render: (t) => t.notes || "—" },
          ]}
        />
      )}

      {activeTab === "vaccines" && (
        <HistoryTable<Vaccine>
          rows={patient.vaccines}
          emptyMessage="Sin vacunas registradas."
          columns={[
            { header: "Vacuna", render: (v) => v.name },
            { header: "Aplicada", render: (v) => v.dateApplied },
            { header: "Próxima dosis", render: (v) => v.nextDueDate || "—" },
          ]}
        />
      )}
    </div>
  );
}
