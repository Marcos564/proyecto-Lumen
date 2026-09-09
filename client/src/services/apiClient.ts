import axios from 'axios'

/**
 * Cliente HTTP ya configurado para el día que exista la API real en C# / ASP.NET Core.
 * Todavía no se usa: los services/*.service.ts resuelven contra mocks en memoria.
 * Cuando la API exista, alcanza con reemplazar el cuerpo de esos services por
 * llamadas a este `apiClient` y setear VITE_API_BASE_URL.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})
