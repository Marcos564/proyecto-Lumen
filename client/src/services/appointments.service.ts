import type { Appointment, AppointmentStatus } from '../types'
import { appointmentsMock } from './mock/appointments.mock'
import { delay } from './mock/delay'

let appointments: Appointment[] = [...appointmentsMock]

export type AppointmentInput = Omit<Appointment, 'id'>

// Fecha y hora en formato 24 h: YYYY-MM-DDTHH:mm (00:00 a 23:59)
const DATE_TIME_24H = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/

function assertValidDate(date: string) {
  if (!DATE_TIME_24H.test(date)) throw new Error(`Invalid appointment date: ${date}`)
}

export async function getAppointments(): Promise<Appointment[]> {
  await delay()
  return appointments
}

export async function createAppointment(data: AppointmentInput): Promise<Appointment> {
  assertValidDate(data.date)
  await delay()
  const newAppointment: Appointment = { ...data, id: crypto.randomUUID() }
  appointments = [...appointments, newAppointment]
  return newAppointment
}

export async function updateAppointment(id: string, data: AppointmentInput): Promise<Appointment> {
  assertValidDate(data.date)
  await delay()
  appointments = appointments.map((appointment) => (appointment.id === id ? { ...appointment, ...data } : appointment))
  const updated = appointments.find((appointment) => appointment.id === id)
  if (!updated) throw new Error('Appointment not found')
  return updated
}

const VALID_STATUSES: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled']

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
  if (!VALID_STATUSES.includes(status)) throw new Error(`Invalid appointment status: ${status}`)
  await delay()
  const current = appointments.find((appointment) => appointment.id === id)
  if (!current) throw new Error('Appointment not found')
  const updated: Appointment = { ...current, status }
  appointments = appointments.map((appointment) => (appointment.id === id ? updated : appointment))
  return updated
}

export async function deleteAppointment(id: string): Promise<void> {
  await delay()
  appointments = appointments.filter((appointment) => appointment.id !== id)
}
