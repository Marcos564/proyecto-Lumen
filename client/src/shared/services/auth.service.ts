import { getApiErrorMessage } from "../api/apiError";
import { instance } from "../api/axiosInstance";
import type { SignInRequest, SignInResponse } from "../types/auth";

export const authService = {
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    try {
      const response = await instance.post<SignInResponse>("/auth/signin/", data);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error(getApiErrorMessage(error, "No se pudo iniciar sesión."));
    }
  },
};
