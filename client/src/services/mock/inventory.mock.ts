import type { InventoryItem } from '../../types'

export const inventoryMock: InventoryItem[] = [
  { id: 'i1', name: 'Amoxicilina 250mg', category: 'medication', stock: 42, minStock: 20, unit: 'unidades' },
  { id: 'i2', name: 'Vacuna antirrábica', category: 'medication', stock: 8, minStock: 15, unit: 'dosis' },
  { id: 'i3', name: 'Jeringas 5ml', category: 'supply', stock: 120, minStock: 50, unit: 'unidades' },
  { id: 'i4', name: 'Alimento balanceado adulto', category: 'food', stock: 30, minStock: 10, unit: 'kg' },
  { id: 'i5', name: 'Guantes de látex', category: 'supply', stock: 5, minStock: 30, unit: 'cajas' },
  { id: 'i6', name: 'Shampoo antipulgas', category: 'other', stock: 18, minStock: 10, unit: 'unidades' },
]
