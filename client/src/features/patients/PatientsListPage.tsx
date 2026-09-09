import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { SearchInput } from '../../components/ui/SearchInput'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
  type PatientInput,
} from '../../services/patients.service'
import type { Patient } from '../../types'
import { PatientForm } from './PatientForm'

export function PatientsListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
  }

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientInput }) => updatePatient(id, data),
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditingPatient(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: invalidate,
  })

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return patients
    return patients.filter((patient) => patient.name.toLowerCase().includes(term) || patient.ownerName.toLowerCase().includes(term))
  }, [patients, search])

  function openCreateModal() {
    setEditingPatient(null)
    setModalOpen(true)
  }

  function openEditModal(patient: Patient) {
    setEditingPatient(patient)
    setModalOpen(true)
  }

  function handleSubmit(values: PatientInput) {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data: values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Pacientes</h1>
          <p className="text-sm text-slate-500">Listado de mascotas registradas en la clínica.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por paciente o dueño..." />

      <Table<Patient>
        data={filteredPatients}
        keyExtractor={(patient) => patient.id}
        onRowClick={(patient) => navigate(`/pacientes/${patient.id}`)}
        emptyMessage={isLoading ? 'Cargando pacientes...' : 'No se encontraron pacientes.'}
        columns={[
          { header: 'Nombre', render: (p) => <span className="font-medium text-slate-800">{p.name}</span> },
          { header: 'Especie / Raza', render: (p) => `${p.species} · ${p.breed}` },
          { header: 'Dueño', render: (p) => p.ownerName },
          { header: 'Contacto', render: (p) => p.ownerPhone || '—' },
          {
            header: 'Estado',
            render: (p) => <Badge tone={p.status === 'active' ? 'success' : 'neutral'}>{p.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>,
          },
          {
            header: '',
            className: 'w-20',
            render: (p) => (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <IconButton icon={Pencil} label="Editar" onClick={() => openEditModal(p)} />
                <IconButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => deleteMutation.mutate(p.id)} />
              </div>
            ),
          },
        ]}
      />

      <Modal open={isModalOpen} title={editingPatient ? 'Editar paciente' : 'Nuevo paciente'} onClose={() => setModalOpen(false)}>
        <PatientForm
          initialValues={editingPatient ?? undefined}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
