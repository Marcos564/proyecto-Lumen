// Insumo del inventario. El backend todavía no expone este recurso, por eso
// se mantiene con datos mock.
export type InventoryCategory = "medication" | "supply" | "food" | "other";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unit: string;
}

/** Datos que envía el formulario; el id lo genera el servicio. */
export type InventoryItemInput = Omit<InventoryItem, "id">;
