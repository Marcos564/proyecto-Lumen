import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { SearchInput } from '../../components/ui/SearchInput'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import {
  createSpecialist,
  deleteSpecialist,
  getSpecialists,
  updateSpecialist,
  type SpecialistInput,
} from '../../services/specialists.service'
import type { Specialist } from '../../types'
import { SpecialistForm } from './SpecialistForm'

export function SpecialistsListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: specialists = [], isLoading } = useQuery({
    queryKey: ['specialists'],
    queryFn: getSpecialists,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['specialists'] })
  }

  const createMutation = useMutation({
    mutationFn: createSpecialist,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SpecialistInput }) => updateSpecialist(id, data),
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditingSpecialist(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSpecialist,
    onSuccess: invalidate,
  })

  const filteredSpecialists = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return specialists
    return specialists.filter((s) => s.name.toLowerCase().includes(term) || s.specialty.toLowerCase().includes(term))
  }, [specialists, search])

  function openCreateModal() {
    setEditingSpecialist(null)
    setModalOpen(true)
  }

  function openEditModal(specialist: Specialist) {
    setEditingSpecialist(specialist)
    setModalOpen(true)
  }

  function handleSubmit(values: SpecialistInput) {
    if (editingSpecialist) {
      updateMutation.mutate({ id: editingSpecialist.id, data: values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Especialistas</h1>
          <p className="text-sm text-slate-500">Doctores y especialistas de la clínica.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo especialista
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o especialidad..." />

      <Table<Specialist>
        data={filteredSpecialists}
        keyExtractor={(s) => s.id}
        emptyMessage={isLoading ? 'Cargando especialistas...' : 'No se encontraron especialistas.'}
        columns={[
          { header: 'Nombre', render: (s) => <span className="font-medium text-slate-800">{s.name}</span> },
          { header: 'Especialidad', render: (s) => s.specialty },
          { header: 'Email', render: (s) => s.email || '—' },
          { header: 'Teléfono', render: (s) => s.phone || '—' },
          { header: 'Estado', render: (s) => <Badge tone={s.active ? 'success' : 'neutral'}>{s.active ? 'Activo' : 'Inactivo'}</Badge> },
          {
            header: '',
            className: 'w-20',
            render: (s) => (
              <div className="flex items-center gap-1">
                <IconButton icon={Pencil} label="Editar" onClick={() => openEditModal(s)} />
                <IconButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => deleteMutation.mutate(s.id)} />
              </div>
            ),
          },
        ]}
      />

      <Modal open={isModalOpen} title={editingSpecialist ? 'Editar especialista' : 'Nuevo especialista'} onClose={() => setModalOpen(false)}>
        <SpecialistForm
          initialValues={editingSpecialist ?? undefined}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
