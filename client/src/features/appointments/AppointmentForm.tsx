import { useState } from "react";
import { Button } from "@shared/components/ui/Button";
import { ClockTimePicker } from "@shared/components/ui/ClockTimePicker";
import { Field, inputClass } from "@shared/components/ui/Field";
import { isPastDateTime, nowDateTimeValue } from "@shared/utils/dateTime";
import type { AppointmentInput, AppointmentStatus } from "@shared/types";
import type { PetSummary } from "@shared/types/pets";

export interface AppointmentFormProps {
  pets: PetSummary[]
  initialValues?: AppointmentInput
  error?: string
  submitting?: boolean
  onSubmit: (values: AppointmentInput) => void
}

function buildEmptyValues(pets: PetSummary[]): AppointmentInput {
  return {
    patientId: pets[0]?.id ?? "",
    date: "",
    reason: "",
    status: "scheduled",
  };
}

const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function AppointmentForm({ pets, initialValues, error, submitting, onSubmit }: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentInput>(initialValues ?? buildEmptyValues(pets))
  const [pastDateError, setPastDateError] = useState('')

  // La fecha se guarda como "YYYY-MM-DDTHH:mm" (24 h); la hora se elige en el
  // reloj y la fecha con el input nativo, así no dependemos del formato local.
  const [datePart = "", timePart = ""] = values.date.split("T");

  const isEditing = Boolean(initialValues)
  const now = nowDateTimeValue()
  const [today, currentTime] = now.split('T')
  const isToday = !isEditing && datePart === today

  function handleChange<K extends keyof AppointmentInput>(field: K, value: AppointmentInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleDateChange(date: string) {
    setPastDateError('')
    handleChange('date', `${date}T${timePart}`)
  }

  function handleTimeChange(time: string) {
    setPastDateError('')
    handleChange('date', `${datePart || today}T${time}`)
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        // Se vuelve a leer la hora actual al enviar: el modal pudo quedar abierto un rato.
        if (!DATE_TIME_PATTERN.test(values.date)) {
          setPastDateError('Elegí la fecha y la hora del turno.')
          return
        }
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
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} · {pet.specie} {pet.race}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha">
          <input
            type="date"
            className={inputClass}
            value={datePart}
            min={isEditing ? undefined : today}
            onChange={(e) => handleDateChange(e.target.value)}
            required
          />
        </Field>

        {/* Etiqueta aparte: un <label> envolviendo al botón reabriría el popover
            al hacer clic en el texto "Hora" mientras ya está abierto. */}
        <div className="flex flex-col gap-1 text-sm text-slate-600">
          <span>Hora (24 h)</span>
          <ClockTimePicker
            value={timePart}
            minTime={isToday ? currentTime : undefined}
            onChange={handleTimeChange}
          />
        </div>

        <Field label="Estado">
          <select
            className={inputClass}
            value={values.status}
            onChange={(e) =>
              handleChange("status", e.target.value as AppointmentStatus)}
          >
            <option value="scheduled">Programado</option>
            <option value="completed">Completado</option>
          </select>
        </Field>
        <Field label="Motivo" className="col-span-2">
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            rows={3}
            value={values.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Describí el motivo de la consulta..."
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
