export type UserRole = "USUARIO" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
  curso?: string;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  carnet: string;
  password: string;
  role: UserRole;
}
