export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  active: boolean;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
}

export type InventoryCategory = "medication" | "supply" | "food" | "other";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unit: string;
}
