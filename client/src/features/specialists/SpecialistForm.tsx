import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { SpecialistInput } from '../../services/specialists.service'

interface SpecialistFormProps {
  initialValues?: SpecialistInput
  submitting?: boolean
  onSubmit: (values: SpecialistInput) => void
}

const emptyValues: SpecialistInput = {
  name: '',
  specialty: '',
  email: '',
  phone: '',
  active: true,
}

export function SpecialistForm({ initialValues = emptyValues, submitting, onSubmit }: SpecialistFormProps) {
  const [values, setValues] = useState<SpecialistInput>(initialValues)

  function handleChange<K extends keyof SpecialistInput>(field: K, value: SpecialistInput[K]) {
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
        <Field label="Nombre">
          <input className={inputClass} value={values.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </Field>
        <Field label="Especialidad">
          <input className={inputClass} value={values.specialty} onChange={(e) => handleChange('specialty', e.target.value)} required />
        </Field>
        <Field label="Email">
          <input type="email" className={inputClass} value={values.email} onChange={(e) => handleChange('email', e.target.value)} />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={values.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={values.active ? 'active' : 'inactive'}
            onChange={(e) => handleChange('active', e.target.value === 'active')}
          >
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
