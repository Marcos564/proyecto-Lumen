import type { Patient } from '../../types'

export const patientsMock: Patient[] = [
  {
    id: 'p1',
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
    birthDate: '2021-03-14',
    ownerId: 'o1',
    status: 'active',
    treatments: [
      { id: 't1', name: 'Chequeo general', date: '2026-08-10', notes: 'Todo en orden.' },
      { id: 't2', name: 'Limpieza dental', date: '2026-05-02' },
    ],
    vaccines: [
      { id: 'v1', name: 'Rabia', dateApplied: '2026-01-15', nextDueDate: '2027-01-15' },
      { id: 'v2', name: 'Quíntuple', dateApplied: '2026-01-15', nextDueDate: '2026-07-15' },
    ],
  },
  {
    id: 'p2',
    name: 'Bella',
    species: 'Gato',
    breed: 'Siamés',
    birthDate: '2022-07-01',
    ownerId: 'o2',
    status: 'active',
    treatments: [{ id: 't3', name: 'Desparasitación', date: '2026-07-20' }],
    vaccines: [{ id: 'v3', name: 'Triple felina', dateApplied: '2026-02-10', nextDueDate: '2027-02-10' }],
  },
  {
    id: 'p3',
    name: 'Charlie',
    species: 'Perro',
    breed: 'Beagle',
    birthDate: '2019-11-23',
    ownerId: 'o3',
    status: 'inactive',
    treatments: [],
    vaccines: [{ id: 'v4', name: 'Rabia', dateApplied: '2025-03-01', nextDueDate: '2026-03-01' }],
  },
  {
    id: 'p4',
    name: 'Luna',
    species: 'Gato',
    breed: 'Común europeo',
    birthDate: '2023-01-05',
    ownerId: 'o4',
    status: 'active',
    treatments: [{ id: 't4', name: 'Consulta dermatología', date: '2026-08-28', notes: 'Seguimiento en 15 días.' }],
    vaccines: [],
  },
]
