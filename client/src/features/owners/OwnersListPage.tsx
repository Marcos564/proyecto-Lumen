import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table } from '../../components/ui/Table'
import { SearchInput } from '../../components/ui/SearchInput'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Modal } from '../../components/ui/Modal'
import {
  createOwner,
  deleteOwner,
  getOwners,
  updateOwner,
  type OwnerInput,
  type OwnerWithPets,
} from '../../services/owners.service'
import { OwnerForm } from './OwnerForm'
import { ownerFullName } from './ownerFullName'

export function OwnersListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingOwner, setEditingOwner] = useState<OwnerWithPets | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: getOwners,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['owners'] })
  }

  const createMutation = useMutation({
    mutationFn: createOwner,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OwnerInput }) => updateOwner(id, data),
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditingOwner(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOwner,
    onSuccess: invalidate,
    onError: (error) => window.alert(error.message),
  })

  const filteredOwners = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return owners
    const dniTerm = term.replace(/\./g, '')
    return owners.filter((o) => ownerFullName(o).toLowerCase().includes(term) || (dniTerm !== '' && o.dni.includes(dniTerm)))
  }, [owners, search])

  function openModal(owner: OwnerWithPets | null) {
    createMutation.reset()
    updateMutation.reset()
    setEditingOwner(owner)
    setModalOpen(true)
  }

  function handleSubmit(values: OwnerInput) {
    if (editingOwner) {
      updateMutation.mutate({ id: editingOwner.id, data: values })
    } else {
      createMutation.mutate(values)
    }
  }

  const formError = (createMutation.error ?? updateMutation.error)?.message

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Dueños</h1>
          <p className="text-sm text-slate-500">Responsables de las mascotas atendidas en la clínica.</p>
        </div>
        <Button onClick={() => openModal(null)}>
          <Plus className="h-4 w-4" />
          Nuevo dueño
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o DNI..." />

      <Table<OwnerWithPets>
        data={filteredOwners}
        keyExtractor={(o) => o.id}
        emptyMessage={isLoading ? 'Cargando dueños...' : 'No se encontraron dueños.'}
        columns={[
          { header: 'Nombre', render: (o) => <span className="font-medium text-slate-800">{ownerFullName(o)}</span> },
          { header: 'DNI', render: (o) => o.dni },
          { header: 'Dirección', render: (o) => o.address },
          { header: 'Teléfono', render: (o) => o.phone },
          { header: 'Email', render: (o) => o.email || '—' },
          { header: 'Mascotas', render: (o) => o.petCount },
          {
            header: '',
            className: 'w-20',
            render: (o) => (
              <div className="flex items-center gap-1">
                <IconButton icon={Pencil} label="Editar" onClick={() => openModal(o)} />
                <IconButton
                  icon={Trash2}
                  label={o.petCount > 0 ? 'No se puede eliminar: tiene mascotas' : 'Eliminar'}
                  tone="danger"
                  className="disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={o.petCount > 0}
                  onClick={() => deleteMutation.mutate(o.id)}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal open={isModalOpen} title={editingOwner ? 'Editar dueño' : 'Nuevo dueño'} onClose={() => setModalOpen(false)}>
        <OwnerForm
          initialValues={editingOwner ?? undefined}
          petCount={editingOwner?.petCount}
          error={formError}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
