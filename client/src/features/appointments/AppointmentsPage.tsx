import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
  type AppointmentInput,
} from '../../services/appointments.service'
import { getPatients } from '../../services/patients.service'
import { getSpecialists } from '../../services/specialists.service'
import type { Appointment, AppointmentStatus } from '../../types'
import { AppointmentForm } from './AppointmentForm'

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Programado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const statusTones: Record<AppointmentStatus, 'success' | 'warning' | 'danger'> = {
  scheduled: 'warning',
  completed: 'success',
  cancelled: 'danger',
}

export function AppointmentsPage() {
  const queryClient = useQueryClient()
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: appointments = [], isLoading } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments })
  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: getPatients })
  const { data: specialists = [] } = useQuery({ queryKey: ['specialists'], queryFn: getSpecialists })

  const patientsById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients])
  const specialistsById = useMemo(() => new Map(specialists.map((s) => [s.id, s])), [specialists])

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => a.date.localeCompare(b.date)),
    [appointments],
  )

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['appointments'] })
  }

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentInput }) => updateAppointment(id, data),
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditingAppointment(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: invalidate,
  })

  function openCreateModal() {
    setEditingAppointment(null)
    setModalOpen(true)
  }

  function openEditModal(appointment: Appointment) {
    setEditingAppointment(appointment)
    setModalOpen(true)
  }

  function handleSubmit(values: AppointmentInput) {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data: values })
    } else {
      createMutation.mutate(values)
    }
  }

  const canCreateAppointment = patients.length > 0 && specialists.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Turnos</h1>
          <p className="text-sm text-slate-500">Agenda de turnos de la clínica.</p>
        </div>
        <Button onClick={openCreateModal} disabled={!canCreateAppointment}>
          <Plus className="h-4 w-4" />
          Nuevo turno
        </Button>
      </div>

      <Table<Appointment>
        data={sortedAppointments}
        keyExtractor={(a) => a.id}
        emptyMessage={isLoading ? 'Cargando turnos...' : 'No hay turnos cargados.'}
        columns={[
          { header: 'Fecha', render: (a) => new Date(a.date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) },
          { header: 'Paciente', render: (a) => patientsById.get(a.patientId)?.name ?? '—' },
          { header: 'Especialista', render: (a) => specialistsById.get(a.specialistId)?.name ?? '—' },
          { header: 'Motivo', render: (a) => a.reason },
          { header: 'Estado', render: (a) => <Badge tone={statusTones[a.status]}>{statusLabels[a.status]}</Badge> },
          {
            header: '',
            className: 'w-20',
            render: (a) => (
              <div className="flex items-center gap-1">
                <IconButton icon={Pencil} label="Editar" onClick={() => openEditModal(a)} />
                <IconButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => deleteMutation.mutate(a.id)} />
              </div>
            ),
          },
        ]}
      />

      <Modal open={isModalOpen} title={editingAppointment ? 'Editar turno' : 'Nuevo turno'} onClose={() => setModalOpen(false)}>
        <AppointmentForm
          patients={patients}
          specialists={specialists}
          initialValues={editingAppointment ?? undefined}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
