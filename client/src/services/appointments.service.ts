import type { Appointment } from '../types'
import { appointmentsMock } from './mock/appointments.mock'
import { delay } from './mock/delay'

let appointments: Appointment[] = [...appointmentsMock]

export type AppointmentInput = Omit<Appointment, 'id'>

export async function getAppointments(): Promise<Appointment[]> {
  await delay()
  return appointments
}

export async function createAppointment(data: AppointmentInput): Promise<Appointment> {
  await delay()
  const newAppointment: Appointment = { ...data, id: crypto.randomUUID() }
  appointments = [...appointments, newAppointment]
  return newAppointment
}

export async function updateAppointment(id: string, data: AppointmentInput): Promise<Appointment> {
  await delay()
  appointments = appointments.map((appointment) => (appointment.id === id ? { ...appointment, ...data } : appointment))
  const updated = appointments.find((appointment) => appointment.id === id)
  if (!updated) throw new Error('Appointment not found')
  return updated
}

export async function deleteAppointment(id: string): Promise<void> {
  await delay()
  appointments = appointments.filter((appointment) => appointment.id !== id)
}
