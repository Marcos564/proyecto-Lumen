// Fecha y hora local en el mismo formato que usa Appointment.date: "YYYY-MM-DDTHH:mm".
// Se arma a mano (y no con toISOString) para no pasar a UTC y correr la hora.
export function toDateTimeValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function nowDateTimeValue(): string {
  return toDateTimeValue(new Date())
}

// El formato tiene ancho fijo y va de mayor a menor unidad, así que alcanza con comparar strings.
export function isPastDateTime(value: string, now = nowDateTimeValue()): boolean {
  return value < now
}
