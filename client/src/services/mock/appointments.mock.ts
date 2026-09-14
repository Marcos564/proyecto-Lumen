import type { Appointment } from '../../types'

export const appointmentsMock: Appointment[] = [
  { id: 'a1', patientId: 'p1', date: '2026-09-05T09:00', reason: 'Vacunación', status: 'scheduled' },
  { id: 'a2', patientId: 'p2', date: '2026-09-05T10:30', reason: 'Chequeo general', status: 'scheduled' },
  { id: 'a3', patientId: 'p3', date: '2026-09-05T11:00', reason: 'Limpieza dental', status: 'completed' },
  { id: 'a4', patientId: 'p4', date: '2026-09-06T15:00', reason: 'Consulta', status: 'scheduled' },
  { id: 'a5', patientId: 'p1', date: '2026-08-28T13:00', reason: 'Revisión dental', status: 'cancelled' },
]
