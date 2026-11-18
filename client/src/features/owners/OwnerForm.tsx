import { useState } from "react";
import { Button } from "@shared/components/ui/Button";
import { Field, inputClass } from "@shared/components/ui/Field";
import type { OwnerInput } from "@shared/types";

export interface OwnerFormProps {
  initialValues?: OwnerInput;
  error?: string;
  submitting?: boolean;
  onSubmit: (values: OwnerInput) => void;
}

const emptyValues: OwnerInput = {
  firstName: "",
  lastName: "",
  dni: "",
  address: "",
  phone: "",
  region: "",
  country: "",
  city: "",
  postalCode: "",
};

export function OwnerForm(
  { initialValues = emptyValues, error, submitting, onSubmit }: OwnerFormProps,
) {
  const [values, setValues] = useState<OwnerInput>(initialValues);

  function handleChange<K extends keyof OwnerInput>(
    field: K,
    value: OwnerInput[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre">
          <input
            className={inputClass}
            value={values.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </Field>
        <Field label="Apellido">
          <input
            className={inputClass}
            value={values.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </Field>
        <Field label="DNI">
          <input
            className={inputClass}
            inputMode="numeric"
            pattern="\d{1,2}\.?\d{3}\.?\d{3}"
            title="7 u 8 dígitos, con o sin puntos"
            placeholder="30123456"
            value={values.dni}
            onChange={(e) => handleChange("dni", e.target.value)}
            required
          />
        </Field>
        <Field label="Teléfono">
          <input
            type="tel"
            className={inputClass}
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </Field>
        <div className="col-span-2">
          <Field label="Dirección">
            <input
              className={inputClass}
              value={values.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="Ciudad">
          <input
            className={inputClass}
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </Field>
        <Field label="Provincia / Región">
          <input
            className={inputClass}
            value={values.region}
            onChange={(e) => handleChange("region", e.target.value)}
            required
          />
        </Field>
        <Field label="País">
          <input
            className={inputClass}
            value={values.country}
            onChange={(e) => handleChange("country", e.target.value)}
            required
          />
        </Field>
        <Field label="Código postal">
          <input
            className={inputClass}
            value={values.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            required
          />
        </Field>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
