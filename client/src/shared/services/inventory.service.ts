import type { InventoryItem, InventoryItemInput } from "../types";
import { createMockStore } from "./mock/createMockStore";
import { inventoryMock } from "./mock/inventory.mock";

const store = createMockStore<InventoryItem, InventoryItemInput>({
  seed: inventoryMock,
  notFoundMessage: "Insumo no encontrado",
});

export const inventoryService = {
  list: () => store.list(),

  create: (data: InventoryItemInput) => store.create(data),

  update: (id: string, data: InventoryItemInput) => store.update(id, data),

  remove: (id: string) => store.remove(id),
};
