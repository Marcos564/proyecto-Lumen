import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { PatientInput } from '../../services/patients.service'
import type { Owner } from '../../types'
import { ownerFullName } from '../owners/ownerFullName'

interface PatientFormProps {
  owners: Owner[]
  initialValues?: PatientInput
  submitting?: boolean
  onSubmit: (values: PatientInput) => void
}

const emptyValues: PatientInput = {
  name: '',
  species: '',
  breed: '',
  birthDate: '',
  ownerId: '',
  status: 'active',
}

export function PatientForm({ owners, initialValues = emptyValues, submitting, onSubmit }: PatientFormProps) {
  const [values, setValues] = useState<PatientInput>(initialValues)

  function handleChange<K extends keyof PatientInput>(field: K, value: PatientInput[K]) {
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
        <Field label="Nombre (Mascota)">
          <input className={inputClass} value={values.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </Field>
        <Field label="Especie">
          <input className={inputClass} value={values.species} onChange={(e) => handleChange('species', e.target.value)} required />
        </Field>
        <Field label="Raza">
          <input className={inputClass} value={values.breed} onChange={(e) => handleChange('breed', e.target.value)} required />
        </Field>
        <Field label="Fecha de nacimiento">
          <input type="date" className={inputClass} value={values.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)} />
        </Field>
        <Field label="Dueño">
          <select className={inputClass} value={values.ownerId} onChange={(e) => handleChange('ownerId', e.target.value)} required>
            <option value="" disabled>
              Seleccioná un dueño
            </option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {ownerFullName(owner)} · DNI {owner.dni}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select className={inputClass} value={values.status} onChange={(e) => handleChange('status', e.target.value as PatientInput['status'])}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
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
