import { TableSkeleton } from "@shared/components/ui/Skeletons";
import type { MedicalRecord } from "@shared/types/pets";
import { useMedicalRecords } from "../hooks/usePets";
import { HistoryTable } from "./HistoryTable";

interface MedicalHistoryTabProps {
  petId: string;
}

/**
 * Historia clínica de la mascota.
 *
 * Vive en su propio chunk y solo se monta cuando la tab está activa, así el
 * detalle no dispara el request de registros si el usuario no los consulta.
 */
export function MedicalHistoryTab({ petId }: MedicalHistoryTabProps) {
  const { data: medicalRecords = [], isLoading } = useMedicalRecords(petId);

  if (isLoading) {
    return <TableSkeleton rows={4} columns={3} />;
  }

  return (
    <HistoryTable<MedicalRecord>
      rows={medicalRecords}
      emptyMessage="No hay registros de historia clínica."
      columns={[
        { header: "Registro", render: (record) => record.title },
        {
          header: "Temperatura",
          render: (record) => `${record.temperature} °C`,
        },
        {
          header: "Peso",
          render: (record) => `${record.weight} kg`,
        },
      ]}
    />
  );
}
