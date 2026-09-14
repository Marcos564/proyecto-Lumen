import { useState } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PawPrint, User, type LucideIcon } from 'lucide-react'
import { getPatientById } from '../../services/patients.service'
import { getOwnerById } from '../../services/owners.service'
import { ownerFullName } from '../owners/ownerFullName'
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

  const { data: owner } = useQuery({
    queryKey: ['owners', patient?.ownerId],
    queryFn: () => getOwnerById(patient?.ownerId as string),
    enabled: Boolean(patient?.ownerId),
  })

  if (isLoading) return <p className="text-sm text-slate-500">Cargando ficha...</p>
  if (!patient) return <p className="text-sm text-slate-500">Paciente no encontrado.</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{patient.name}</h1>
        <p className="text-sm text-slate-500">
          {patient.species} · {patient.breed} · Dueño: {owner ? ownerFullName(owner) : '—'}
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-4">
            <SectionTitle icon={PawPrint} title="Mascota" />
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Nombre" value={patient.name} />
              <InfoRow label="Especie" value={patient.species} />
              <InfoRow label="Raza" value={patient.breed} />
              <InfoRow label="Fecha de nacimiento" value={patient.birthDate || '—'} />
              <InfoRow
                label="Estado"
                value={<Badge tone={patient.status === 'active' ? 'success' : 'neutral'}>{patient.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <SectionTitle icon={User} title="Dueño" />
            {owner ? (
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Nombre" value={ownerFullName(owner)} />
                <InfoRow label="DNI" value={owner.dni} />
                <InfoRow label="Teléfono" value={owner.phone} />
                <InfoRow label="Email" value={owner.email || '—'} />
                <InfoRow label="Dirección" value={owner.address} />
                <InfoRow label="Mascotas registradas" value={owner.petCount} />
              </div>
            ) : (
              <p className="text-sm text-slate-400">Cargando datos del dueño...</p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'treatments' && (
        <Card>
          {patient.treatments.length === 0 ? (
            <p className="text-sm text-slate-400">Sin tratamientos registrados.</p>
          ) : (
            <div className="overflow-x-auto border border-slate-300">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-teal-600">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Tratamiento</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Fecha</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {patient.treatments.map((treatment) => (
                    <tr key={treatment.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-700">{treatment.name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{treatment.date}</td>
                      <td className="px-4 py-2.5 text-slate-500">{treatment.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'vaccines' && (
        <Card>
          {patient.vaccines.length === 0 ? (
            <p className="text-sm text-slate-400">Sin vacunas registradas.</p>
          ) : (
            <div className="overflow-x-auto border border-slate-300">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-teal-600">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Vacuna</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Aplicada</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">Próxima dosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {patient.vaccines.map((vaccine) => (
                    <tr key={vaccine.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-700">{vaccine.name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{vaccine.dateApplied}</td>
                      <td className="px-4 py-2.5 text-slate-500">{vaccine.nextDueDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
        <Icon className="h-4 w-4" />
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h2>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs tracking-wide text-slate-400 uppercase">{label}</span>
      <span className="text-slate-700 wrap-anywhere">{value}</span>
    </div>
  )
}
