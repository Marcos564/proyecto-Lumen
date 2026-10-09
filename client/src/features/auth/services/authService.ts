import { instance } from "../../../shared/index.ts";
import {
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
} from "../index.ts";
export const authService = {
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    try {
      const response = await instance.post<SignInResponse>(
        "/auth/signin",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      handleConnectionError(error, "login");

      // OBLIGATORIO: Volver a lanzar el error para que el Caller (Context o Form) sepa que falló
      throw error;
    }
  },
  signUp: async (data: SignUpRequest): Promise<SignUpRequest> => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.email,
      };

      // Revisa la ruta según la baseURL de tu instancia
      const response = await instance.post<SignUpRequest>(
        "/students/signup",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      handleConnectionError(error, "registro");

      throw error;
    }
  },
};
const handleConnectionError = (error: any, context: string) => {
  console.error(`--- DEBUG ERROR EN ${context.toUpperCase()} ---`);

  if (error.response) {
    const serverData = error.response.data;
    console.error("Status:", error.response.status);
    console.error("Data del servidor:", serverData);
    const detailedMessage = serverData?.detail ||
      serverData?.message ||
      serverData?.title ||
      (serverData?.errors ? JSON.stringify(serverData.errors) : null);

    if (detailedMessage) {
      throw new Error(detailedMessage);
    }
  } else if (error.request) {
    console.error(
      "No se recibió respuesta del servidor. Revisa CORS o si el puerto 5073 está abierto.",
    );
    throw new Error(
      "No se pudo conectar con el servidor. ¿Está encendido el Backend?",
    );
  } else {
    console.error("Error de configuración:", error.message);
  }

  throw error;
};
