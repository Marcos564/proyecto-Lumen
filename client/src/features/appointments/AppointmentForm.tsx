import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { AppointmentInput } from '../../services/appointments.service'
import type { AppointmentStatus, Owner, Patient } from '../../types'
import { ownerFullName } from '../owners/ownerFullName'

interface AppointmentFormProps {
  patients: Patient[]
  owners: Owner[]
  initialValues?: AppointmentInput
  submitting?: boolean
  onSubmit: (values: AppointmentInput) => void
}

function buildEmptyValues(patients: Patient[]): AppointmentInput {
  return {
    patientId: patients[0]?.id ?? '',
    date: '',
    reason: '',
    status: 'scheduled',
  }
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export function AppointmentForm({ patients, owners, initialValues, submitting, onSubmit }: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentInput>(initialValues ?? buildEmptyValues(patients))
  const ownersById = new Map(owners.map((owner) => [owner.id, owner]))

  // La fecha se guarda como "YYYY-MM-DDTHH:mm" (24 h); se edita en partes para no depender del formato AM/PM del navegador.
  const [datePart = '', timePart = ''] = values.date.split('T')
  const [hourPart = '', minutePart = ''] = timePart.split(':')

  function handleChange<K extends keyof AppointmentInput>(field: K, value: AppointmentInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleDateTimeChange(date: string, hour: string, minute: string) {
    handleChange('date', `${date}T${hour}:${minute}`)
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
            {patients.map((patient) => {
              const owner = ownersById.get(patient.ownerId)
              return (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({owner ? ownerFullName(owner) : '—'})
                </option>
              )
            })}
          </select>
        </Field>
        <Field label="Fecha">
          <input
            type="date"
            className={inputClass}
            value={datePart}
            onChange={(e) => handleDateTimeChange(e.target.value, hourPart, minutePart)}
            required
          />
        </Field>
        <Field label="Hora (24 h)">
          <div className="flex items-center gap-2">
            <select
              aria-label="Hora"
              className={inputClass}
              value={hourPart}
              onChange={(e) => handleDateTimeChange(datePart, e.target.value, minutePart)}
              required
            >
              <option value="" disabled>
                HH
              </option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="text-slate-500">:</span>
            <select
              aria-label="Minutos"
              className={inputClass}
              value={minutePart}
              onChange={(e) => handleDateTimeChange(datePart, hourPart, e.target.value)}
              required
            >
              <option value="" disabled>
                mm
              </option>
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
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
