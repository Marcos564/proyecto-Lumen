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

export type PatientStatus = 'active' | 'inactive'

export interface Patient {
  id: string
  name: string
  species: string
  breed: string
  birthDate?: string
  ownerName: string
  ownerPhone?: string
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
  specialistId: string
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
