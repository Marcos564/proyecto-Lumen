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
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  type InventoryItemInput,
} from '../../services/inventory.service'
import type { InventoryCategory, InventoryItem } from '../../types'
import { InventoryItemForm } from './InventoryItemForm'

const categoryLabels: Record<InventoryCategory, string> = {
  medication: 'Medicamento',
  supply: 'Insumo',
  food: 'Alimento',
  other: 'Otro',
}

export function InventoryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const { data: items = [], isLoading } = useQuery({ queryKey: ['inventory'], queryFn: getInventoryItems })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['inventory'] })
  }

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InventoryItemInput }) => updateInventoryItem(id, data),
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditingItem(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: invalidate,
  })

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) => item.name.toLowerCase().includes(term))
  }, [items, search])

  function openCreateModal() {
    setEditingItem(null)
    setModalOpen(true)
  }

  function openEditModal(item: InventoryItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  function handleSubmit(values: InventoryItemInput) {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Inventario</h1>
          <p className="text-sm text-slate-500">Stock de medicamentos e insumos.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo insumo
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar insumo..." />

      <Table<InventoryItem>
        data={filteredItems}
        keyExtractor={(item) => item.id}
        emptyMessage={isLoading ? 'Cargando inventario...' : 'No se encontraron insumos.'}
        columns={[
          { header: 'Nombre', render: (item) => <span className="font-medium text-slate-800">{item.name}</span> },
          { header: 'Categoría', render: (item) => categoryLabels[item.category] },
          { header: 'Stock', render: (item) => `${item.stock} ${item.unit}` },
          { header: 'Mínimo', render: (item) => `${item.minStock} ${item.unit}` },
          {
            header: 'Estado',
            render: (item) =>
              item.stock <= item.minStock ? <Badge tone="danger">Stock bajo</Badge> : <Badge tone="success">OK</Badge>,
          },
          {
            header: '',
            className: 'w-20',
            render: (item) => (
              <div className="flex items-center gap-1">
                <IconButton icon={Pencil} label="Editar" onClick={() => openEditModal(item)} />
                <IconButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => deleteMutation.mutate(item.id)} />
              </div>
            ),
          },
        ]}
      />

      <Modal open={isModalOpen} title={editingItem ? 'Editar insumo' : 'Nuevo insumo'} onClose={() => setModalOpen(false)}>
        <InventoryItemForm
          initialValues={editingItem ?? undefined}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}
