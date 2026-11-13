import { useCrudResource } from "@shared/hooks/useCrudResource";
import { inventoryService } from "@shared/services/inventory.service";

export const inventoryKeys = {
  all: ["inventory"] as const,
};

export function useInventory() {
  return useCrudResource(inventoryKeys.all, inventoryService);
}
