export interface Specie {
  name: string;
}
export interface Breed {
  name: string;
}
export const speciesBreeds: Map<Specie, Breed[]> = new Map([
  [{ name: "Perro" }, [{ name: "Labrador" }, { name: "Pastor Alemán" }, { name: "Beagle" }]],
  [{ name: "Gato" }, [{ name: "Siames" }, { name: "Persa" }, { name: "Maine Coon" }]],
  [{ name: "Ave" }, [{ name: "Canario" }, { name: "Loro" }, { name: "Paloma" }]],
  [{ name: "Roedores" }, [{ name: "Hamster" }, { name: "Conejo" }, { name: "Erizo" }]],
]);
export const breeds: Breed[] = Array.from(speciesBreeds.values()).flat();
export const species: Specie[] = [
  { name: "Perro" },
  { name: "Gato" },
  { name: "Ave" },
  { name: "Roedores" }
];
export const breedSpecies: Map<Breed, Specie> = new Map([
  [{ name: "Labrador" }, { name: "Perro" }],
  [{ name: "Pastor Alemán" }, { name: "Perro" }],
  [{ name: "Beagle" }, { name: "Perro" }],
  [{ name: "Siames" }, { name: "Gato" }],
  [{ name: "Persa" }, { name: "Gato" }],
  [{ name: "Maine Coon" }, { name: "Gato" }],
  [{ name: "Canario" }, { name: "Ave" }],
  [{ name: "Loro" }, { name: "Ave" }],
  [{ name: "Paloma" }, { name: "Ave" }],
  [{ name: "Hamster" }, { name: "Roedores" }],
  [{ name: "Conejo" }, { name: "Roedores" }],
  [{ name: "Erizo" }, { name: "Roedores" }]]);