export interface Treatment {
  id: string
  name: string
  date: string
  notes?: string
}

export interface Vaccine {
  id: string
  name: string
  dateApplied: string
  nextDueDate?: string
}

export interface Owner {
  id: string
  firstName: string
  lastName: string
  dni: string
  address: string
  phone: string
  email?: string
}

export type PatientStatus = 'active' | 'inactive'

export interface Patient {
  id: string
  name: string
  species: string
  breed: string
  birthDate?: string
  ownerId: string
  status: PatientStatus
  treatments: Treatment[]
  vaccines: Vaccine[]
}

export interface Specialist {
  id: string
  name: string
  specialty: string
  email?: string
  phone?: string
  active: boolean
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  patientId: string
  date: string
  reason: string
  status: AppointmentStatus
}

export type InventoryCategory = 'medication' | 'supply' | 'food' | 'other'

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  stock: number
  minStock: number
  unit: string
}
