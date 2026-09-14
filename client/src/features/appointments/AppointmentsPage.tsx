import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Modal } from '../../components/ui/Modal'
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
  type AppointmentInput,
} from '../../services/appointments.service'
import { getPatients } from '../../services/patients.service'
import { getOwners } from '../../services/owners.service'
import type { Appointment, AppointmentStatus } from '../../types'
import { AppointmentForm } from './AppointmentForm'
import { AppointmentStatusPopover } from './AppointmentStatusPopover'

export function AppointmentsPage() {
  const queryClient = useQueryClient()
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: appointments = [], isLoading } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments })
  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: getPatients })
  const { data: owners = [] } = useQuery({ queryKey: ['owners'], queryFn: getOwners })

  const patientsById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients])

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

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) => updateAppointmentStatus(id, status),
    onSuccess: invalidate,
    onError: (error) => window.alert(error.message),
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

  const canCreateAppointment = patients.length > 0

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
          { header: 'Fecha', render: (a) => new Date(a.date).toLocaleDateString('es-AR', { dateStyle: 'short' }) },
          { header: 'Hora', render: (a) => new Date(a.date).toLocaleTimeString('es-AR', { timeStyle: 'short', hourCycle: 'h23' }) },
          { header: 'Paciente', render: (a) => patientsById.get(a.patientId)?.name ?? '—' },
          { header: 'Motivo', render: (a) => a.reason },
          {
            header: 'Estado',
            render: (a) => (
              <AppointmentStatusPopover
                status={a.status}
                disabled={statusMutation.isPending && statusMutation.variables?.id === a.id}
                onChange={(status) => statusMutation.mutate({ id: a.id, status })}
              />
            ),
          },
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
          owners={owners}
          initialValues={editingAppointment ?? undefined}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
