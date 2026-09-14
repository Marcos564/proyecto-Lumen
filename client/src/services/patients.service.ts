import type { Patient } from '../types'
import { patientsMock } from './mock/patients.mock'
import { delay } from './mock/delay'
import { ownerExists } from './owners.service'

let patients: Patient[] = [...patientsMock]

export type PatientInput = Omit<Patient, 'id' | 'treatments' | 'vaccines'>

function assertOwnerExists(ownerId: string) {
  if (!ownerExists(ownerId)) throw new Error('El dueño seleccionado no existe.')
}

export function countPatientsByOwner(ownerId: string): number {
  return patients.filter((patient) => patient.ownerId === ownerId).length
}

export async function getPatients(): Promise<Patient[]> {
  await delay()
  return patients
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  await delay()
  return patients.find((patient) => patient.id === id)
}

export async function createPatient(data: PatientInput): Promise<Patient> {
  await delay()
  assertOwnerExists(data.ownerId)
  const newPatient: Patient = { ...data, id: crypto.randomUUID(), treatments: [], vaccines: [] }
  patients = [...patients, newPatient]
  return newPatient
}

export async function updatePatient(id: string, data: PatientInput): Promise<Patient> {
  await delay()
  assertOwnerExists(data.ownerId)
  patients = patients.map((patient) => (patient.id === id ? { ...patient, ...data } : patient))
  const updated = patients.find((patient) => patient.id === id)
  if (!updated) throw new Error('Patient not found')
  return updated
}

export async function deletePatient(id: string): Promise<void> {
  await delay()
  patients = patients.filter((patient) => patient.id !== id)
}
