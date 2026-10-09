export type AuthMode = "login" | "register" | "forgot-password";
export interface User {
  id: string;
  email: string;
  fullName: string;
}
export interface SignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface SignUpRequest {
  name: string;
  surname: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  email: string;
  acceptTerms: boolean;
}
export interface User {
  id: string;
  email: string;
  fullName: string;
  petName?: string;
}
export interface SignInResponse {
  token: string;
  date: Date;
}
