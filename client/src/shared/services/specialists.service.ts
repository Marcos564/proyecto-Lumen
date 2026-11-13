import type { Specialist, SpecialistInput } from "../types";
import { createMockStore } from "./mock/createMockStore";
import { specialistsMock } from "./mock/specialists.mock";

const store = createMockStore<Specialist, SpecialistInput>({
  seed: specialistsMock,
  notFoundMessage: "Especialista no encontrado",
});

export const specialistsService = {
  list: () => store.list(),

  getById: (id: string) => store.getById(id),

  create: (data: SpecialistInput) => store.create(data),

  update: (id: string, data: SpecialistInput) => store.update(id, data),

  remove: (id: string) => store.remove(id),
};
