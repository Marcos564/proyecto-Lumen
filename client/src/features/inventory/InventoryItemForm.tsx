import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field, inputClass } from '../../components/ui/Field'
import type { InventoryItemInput } from '../../services/inventory.service'
import type { InventoryCategory } from '../../types'

interface InventoryItemFormProps {
  initialValues?: InventoryItemInput
  submitting?: boolean
  onSubmit: (values: InventoryItemInput) => void
}

const emptyValues: InventoryItemInput = {
  name: '',
  category: 'supply',
  stock: 0,
  minStock: 0,
  unit: '',
}

export function InventoryItemForm({ initialValues = emptyValues, submitting, onSubmit }: InventoryItemFormProps) {
  const [values, setValues] = useState<InventoryItemInput>(initialValues)

  function handleChange<K extends keyof InventoryItemInput>(field: K, value: InventoryItemInput[K]) {
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
        <Field label="Categoría">
          <select className={inputClass} value={values.category} onChange={(e) => handleChange('category', e.target.value as InventoryCategory)}>
            <option value="medication">Medicamento</option>
            <option value="supply">Insumo</option>
            <option value="food">Alimento</option>
            <option value="other">Otro</option>
          </select>
        </Field>
        <Field label="Stock actual">
          <input
            type="number"
            min={0}
            className={inputClass}
            value={values.stock}
            onChange={(e) => handleChange('stock', Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Stock mínimo">
          <input
            type="number"
            min={0}
            className={inputClass}
            value={values.minStock}
            onChange={(e) => handleChange('minStock', Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Unidad">
          <input className={inputClass} value={values.unit} onChange={(e) => handleChange('unit', e.target.value)} placeholder="unidades, kg, dosis..." required />
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
