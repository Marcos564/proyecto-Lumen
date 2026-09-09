import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { AppointmentInput } from '../../services/appointments.service'
import type { AppointmentStatus, Patient, Specialist } from '../../types'

interface AppointmentFormProps {
  patients: Patient[]
  specialists: Specialist[]
  initialValues?: AppointmentInput
  submitting?: boolean
  onSubmit: (values: AppointmentInput) => void
}

function buildEmptyValues(patients: Patient[], specialists: Specialist[]): AppointmentInput {
  return {
    patientId: patients[0]?.id ?? '',
    specialistId: specialists[0]?.id ?? '',
    date: '',
    reason: '',
    status: 'scheduled',
  }
}

export function AppointmentForm({ patients, specialists, initialValues, submitting, onSubmit }: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentInput>(initialValues ?? buildEmptyValues(patients, specialists))

  function handleChange<K extends keyof AppointmentInput>(field: K, value: AppointmentInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Paciente">
          <select className={inputClass} value={values.patientId} onChange={(e) => handleChange('patientId', e.target.value)} required>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.ownerName})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Especialista">
          <select className={inputClass} value={values.specialistId} onChange={(e) => handleChange('specialistId', e.target.value)} required>
            {specialists.map((specialist) => (
              <option key={specialist.id} value={specialist.id}>
                {specialist.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha y hora">
          <input
            type="datetime-local"
            className={inputClass}
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </Field>
        <Field label="Estado">
          <select className={inputClass} value={values.status} onChange={(e) => handleChange('status', e.target.value as AppointmentStatus)}>
            <option value="scheduled">Programado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </Field>
        <Field label="Motivo">
          <input className={inputClass} value={values.reason} onChange={(e) => handleChange('reason', e.target.value)} required />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
