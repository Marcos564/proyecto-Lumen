import { useState } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPatientById } from '../../services/patients.service'
import { Card } from '../../components/ui/Card'
import { Tabs } from '../../components/ui/Tabs'
import { Badge } from '../../components/ui/Badge'

const tabs = [
  { id: 'info', label: 'Info general' },
  { id: 'treatments', label: 'Tratamientos' },
  { id: 'vaccines', label: 'Vacunas' },
]

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('info')

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patients', id],
    queryFn: () => getPatientById(id as string),
    enabled: Boolean(id),
  })

  if (isLoading) return <p className="text-sm text-slate-500">Cargando ficha...</p>
  if (!patient) return <p className="text-sm text-slate-500">Paciente no encontrado.</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{patient.name}</h1>
        <p className="text-sm text-slate-500">
          {patient.species} · {patient.breed} · Dueño: {patient.ownerName}
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'info' && (
        <Card className="grid grid-cols-2 gap-4">
          <InfoRow label="Nombre" value={patient.name} />
          <InfoRow label="Especie" value={patient.species} />
          <InfoRow label="Raza" value={patient.breed} />
          <InfoRow label="Fecha de nacimiento" value={patient.birthDate || '—'} />
          <InfoRow label="Dueño" value={patient.ownerName} />
          <InfoRow label="Teléfono" value={patient.ownerPhone || '—'} />
          <InfoRow
            label="Estado"
            value={<Badge tone={patient.status === 'active' ? 'success' : 'neutral'}>{patient.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>}
          />
        </Card>
      )}

      {activeTab === 'treatments' && (
        <Card>
          {patient.treatments.length === 0 ? (
            <p className="text-sm text-slate-400">Sin tratamientos registrados.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">Tratamiento</th>
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td className="py-2 pr-4 text-slate-700">{treatment.name}</td>
                    <td className="py-2 pr-4 text-slate-500">{treatment.date}</td>
                    <td className="py-2 text-slate-500">{treatment.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {activeTab === 'vaccines' && (
        <Card>
          {patient.vaccines.length === 0 ? (
            <p className="text-sm text-slate-400">Sin vacunas registradas.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">Vacuna</th>
                  <th className="py-2 pr-4 font-medium">Aplicada</th>
                  <th className="py-2 font-medium">Próxima dosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.vaccines.map((vaccine) => (
                  <tr key={vaccine.id}>
                    <td className="py-2 pr-4 text-slate-700">{vaccine.name}</td>
                    <td className="py-2 pr-4 text-slate-500">{vaccine.dateApplied}</td>
                    <td className="py-2 text-slate-500">{vaccine.nextDueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs tracking-wide text-slate-400 uppercase">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  )
}
