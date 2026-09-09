import type { InventoryItem } from '../types'
import { inventoryMock } from './mock/inventory.mock'
import { delay } from './mock/delay'

let inventoryItems: InventoryItem[] = [...inventoryMock]

export type InventoryItemInput = Omit<InventoryItem, 'id'>

export async function getInventoryItems(): Promise<InventoryItem[]> {
  await delay()
  return inventoryItems
}

export async function createInventoryItem(data: InventoryItemInput): Promise<InventoryItem> {
  await delay()
  const newItem: InventoryItem = { ...data, id: crypto.randomUUID() }
  inventoryItems = [...inventoryItems, newItem]
  return newItem
}

export async function updateInventoryItem(id: string, data: InventoryItemInput): Promise<InventoryItem> {
  await delay()
  inventoryItems = inventoryItems.map((item) => (item.id === id ? { ...item, ...data } : item))
  const updated = inventoryItems.find((item) => item.id === id)
  if (!updated) throw new Error('Inventory item not found')
  return updated
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await delay()
  inventoryItems = inventoryItems.filter((item) => item.id !== id)
}
