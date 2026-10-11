import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { AppointmentInput } from '../../services/appointments.service'
import { isPastDateTime, nowDateTimeValue } from '../../services/dateTime'
import type { AppointmentStatus, Owner, Patient } from '../../types'
import { ownerFullName } from '../owners/ownerFullName'

interface AppointmentFormProps {
  patients: Patient[]
  owners: Owner[]
  initialValues?: AppointmentInput
  error?: string
  submitting?: boolean
  onSubmit: (values: AppointmentInput) => void
}

function buildEmptyValues(patients: Patient[]): AppointmentInput {
  return {
    patientId: patients[0]?.id ?? "",
    date: "",
    reason: "",
    status: "scheduled",
  };
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
// Los turnos se agendan cada 5 minutos: 60 opciones sueltas eran imposibles de recorrer.
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))
const lastMinute = minutes[minutes.length - 1]

export function AppointmentForm({ patients, owners, initialValues, error, submitting, onSubmit }: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentInput>(initialValues ?? buildEmptyValues(patients))
  const [pastDateError, setPastDateError] = useState('')
  const ownersById = new Map(owners.map((owner) => [owner.id, owner]))

  // La fecha se guarda como "YYYY-MM-DDTHH:mm" (24 h); se edita en partes para no depender del formato AM/PM del navegador.
  const [datePart = "", timePart = ""] = values.date.split("T");
  const [hourPart = "", minutePart = ""] = timePart.split(":");

  // Un turno nuevo no puede quedar en el pasado. Al editar uno existente no se restringe,
  // porque los turnos ya pasados tienen que poder seguir corrigiéndose.
  const isEditing = Boolean(initialValues)
  const now = nowDateTimeValue()
  const [today, nowTime] = now.split('T')
  const [nowHour, nowMinute] = nowTime.split(':')
  const isToday = !isEditing && datePart === today

  // Un turno ya cargado puede tener minutos fuera de la grilla de a 5 (p. ej. 17:03): se agrega su valor para no perderlo al editar.
  const minuteOptions = minutePart && !minutes.includes(minutePart) ? [...minutes, minutePart].sort() : minutes
  // Una hora de hoy se descarta cuando ya no queda ningún minuto seleccionable dentro de ella.
  const isHourPast = (hour: string) => isToday && `${hour}:${lastMinute}` < nowTime

  function handleChange<K extends keyof AppointmentInput>(field: K, value: AppointmentInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleDateTimeChange(date: string, hour: string, minute: string) {
    setPastDateError('')
    handleChange('date', `${date}T${hour}:${minute}`)
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        // Se vuelve a leer la hora actual al enviar: el modal pudo quedar abierto un rato.
        if (!isEditing && isPastDateTime(values.date)) {
          setPastDateError('El turno no puede quedar en una fecha u hora que ya pasó.')
          return
        }
        setPastDateError('')
        onSubmit(values)
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Paciente">
          <select
            className={inputClass}
            value={values.patientId}
            onChange={(e) => handleChange("patientId", e.target.value)}
            required
          >
            {patients.map((patient) => {
              const owner = ownersById.get(patient.ownerId);
              return (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({owner ? ownerFullName(owner) : "—"})
                </option>
              );
            })}
          </select>
        </Field>
        <Field label="Fecha">
          <input
            type="date"
            className={inputClass}
            value={datePart}
            min={isEditing ? undefined : today}
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
              onChange={(e) =>
                handleDateTimeChange(datePart, e.target.value, minutePart)}
              required
            >
              <option value="" disabled>
                HH
              </option>
              {hours.map((hour) => (
                <option key={hour} value={hour} disabled={isHourPast(hour)}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="text-slate-500">:</span>
            <select
              aria-label="Minutos"
              className={inputClass}
              value={minutePart}
              onChange={(e) =>
                handleDateTimeChange(datePart, hourPart, e.target.value)}
              required
            >
              <option value="" disabled>
                mm
              </option>
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute} disabled={isToday && hourPart === nowHour && minute < nowMinute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={values.status}
            onChange={(e) =>
              handleChange("status", e.target.value as AppointmentStatus)}
          >
            <option value="scheduled">Programado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </Field>
        <Field label="Motivo">
          <input
            className={inputClass}
            value={values.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            required
          />
        </Field>
      </div>
      {(pastDateError || error) && <p className="text-sm text-red-600">{pastDateError || error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
