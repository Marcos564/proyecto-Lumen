export interface User {
  id: string;
  fullName: string;
  email?: string;
}
export interface SignInRequest {
  email: string;
  password: string;
}
export interface SignInResponse {
  accessToken: string;
  expires?: string;
  // El backend devuelve `profile` (ResponseProfileInfo: Id + FullName).
  profile?: User | null;
  // Compatibilidad con respuestas antiguas que devolvían `user`.
  user?: User | null;
}
