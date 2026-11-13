import { useCrudResource } from "@shared/hooks/useCrudResource";
import { specialistsService } from "@shared/services/specialists.service";

export const specialistKeys = {
  all: ["specialists"] as const,
};

export function useSpecialists() {
  return useCrudResource(specialistKeys.all, specialistsService);
}
