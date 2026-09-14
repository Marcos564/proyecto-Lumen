import type { Owner } from '../types'
import { ownersMock } from './mock/owners.mock'
import { delay } from './mock/delay'
import { countPatientsByOwner } from './patients.service'

let owners: Owner[] = [...ownersMock]

export type OwnerInput = Omit<Owner, 'id'>

export interface OwnerWithPets extends Owner {
  petCount: number
}

const DNI_REGEX = /^\d{7,8}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Quita espacios y deja el DNI solo con dígitos (acepta "30.123.456").
function normalizeOwner(data: OwnerInput): OwnerInput {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dni: data.dni.replace(/\D/g, ''),
    address: data.address.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || undefined,
  }
}

function validateOwner(data: OwnerInput, currentId?: string) {
  if (!data.firstName || !data.lastName || !data.address || !data.phone) {
    throw new Error('Nombre, apellido, dirección y teléfono son obligatorios.')
  }
  if (!DNI_REGEX.test(data.dni)) throw new Error('El DNI debe tener 7 u 8 dígitos.')
  if (data.email && !EMAIL_REGEX.test(data.email)) throw new Error('El email no es válido.')
  if (owners.some((owner) => owner.dni === data.dni && owner.id !== currentId)) {
    throw new Error('Ya existe un dueño con ese DNI.')
  }
}

// La cantidad de mascotas no se guarda: se calcula a partir de los pacientes asignados.
function withPetCount(owner: Owner): OwnerWithPets {
  return { ...owner, petCount: countPatientsByOwner(owner.id) }
}

export function ownerExists(id: string): boolean {
  return owners.some((owner) => owner.id === id)
}

export async function getOwners(): Promise<OwnerWithPets[]> {
  await delay()
  return owners.map((owner) => withPetCount(owner))
}

export async function getOwnerById(id: string): Promise<OwnerWithPets | undefined> {
  await delay()
  const owner = owners.find((o) => o.id === id)
  return owner && withPetCount(owner)
}

export async function createOwner(data: OwnerInput): Promise<Owner> {
  await delay()
  const values = normalizeOwner(data)
  validateOwner(values)
  const newOwner: Owner = { ...values, id: crypto.randomUUID() }
  owners = [...owners, newOwner]
  return newOwner
}

export async function updateOwner(id: string, data: OwnerInput): Promise<Owner> {
  await delay()
  const values = normalizeOwner(data)
  validateOwner(values, id)
  owners = owners.map((owner) => (owner.id === id ? { ...owner, ...values } : owner))
  const updated = owners.find((owner) => owner.id === id)
  if (!updated) throw new Error('Owner not found')
  return updated
}

export async function deleteOwner(id: string): Promise<void> {
  await delay()
  if (countPatientsByOwner(id) > 0) {
    throw new Error('No se puede eliminar un dueño que tiene mascotas registradas.')
  }
  owners = owners.filter((owner) => owner.id !== id)
}
