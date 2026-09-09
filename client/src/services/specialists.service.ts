import type { Specialist } from '../types'
import { specialistsMock } from './mock/specialists.mock'
import { delay } from './mock/delay'

let specialists: Specialist[] = [...specialistsMock]

export type SpecialistInput = Omit<Specialist, 'id'>

export async function getSpecialists(): Promise<Specialist[]> {
  await delay()
  return specialists
}

export async function getSpecialistById(id: string): Promise<Specialist | undefined> {
  await delay()
  return specialists.find((specialist) => specialist.id === id)
}

export async function createSpecialist(data: SpecialistInput): Promise<Specialist> {
  await delay()
  const newSpecialist: Specialist = { ...data, id: crypto.randomUUID() }
  specialists = [...specialists, newSpecialist]
  return newSpecialist
}

export async function updateSpecialist(id: string, data: SpecialistInput): Promise<Specialist> {
  await delay()
  specialists = specialists.map((specialist) => (specialist.id === id ? { ...specialist, ...data } : specialist))
  const updated = specialists.find((specialist) => specialist.id === id)
  if (!updated) throw new Error('Specialist not found')
  return updated
}

export async function deleteSpecialist(id: string): Promise<void> {
  await delay()
  specialists = specialists.filter((specialist) => specialist.id !== id)
}
