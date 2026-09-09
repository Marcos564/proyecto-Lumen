import type { Patient } from '../types'
import { patientsMock } from './mock/patients.mock'
import { delay } from './mock/delay'

let patients: Patient[] = [...patientsMock]

export type PatientInput = Omit<Patient, 'id' | 'treatments' | 'vaccines'>

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
  const newPatient: Patient = { ...data, id: crypto.randomUUID(), treatments: [], vaccines: [] }
  patients = [...patients, newPatient]
  return newPatient
}

export async function updatePatient(id: string, data: PatientInput): Promise<Patient> {
  await delay()
  patients = patients.map((patient) => (patient.id === id ? { ...patient, ...data } : patient))
  const updated = patients.find((patient) => patient.id === id)
  if (!updated) throw new Error('Patient not found')
  return updated
}

export async function deletePatient(id: string): Promise<void> {
  await delay()
  patients = patients.filter((patient) => patient.id !== id)
}
