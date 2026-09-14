import type { AppointmentStatus } from '../../types'

export const appointmentStatuses: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled']

export const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Programado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export const statusTones: Record<AppointmentStatus, 'success' | 'warning' | 'danger'> = {
  scheduled: 'warning',
  completed: 'success',
  cancelled: 'danger',
}
