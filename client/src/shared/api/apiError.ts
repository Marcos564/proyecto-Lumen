import axios from "axios";

interface ApiProblem {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

const DEFAULT_MESSAGE =
  "No se pudo conectar con el servidor. ¿Está encendido el Backend?";

function problemMessage(problem: ApiProblem): string | undefined {
  const validationErrors = problem.errors
    ? Object.values(problem.errors).flat().join(" ")
    : undefined;

  return problem.detail || problem.message || validationErrors || problem.title;
}

/**
 * Extrae el mensaje legible de un error HTTP.
 *
 * ASP.NET Core devuelve `ProblemDetails` (`title`, `detail`, `errors`), pero
 * Axios expone un mensaje genérico ("Request failed with status code 400").
 * Centralizar la extracción evita repetir esta lógica en cada service.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = DEFAULT_MESSAGE,
): string {
  if (axios.isAxiosError<ApiProblem>(error)) {
    const problem = error.response?.data;
    const message = problem && problemMessage(problem);
    if (message) return message;

    if (!error.response && error.request) return fallback;
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
