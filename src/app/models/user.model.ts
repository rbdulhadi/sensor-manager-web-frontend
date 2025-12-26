export enum Role {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: Role;
}

export interface UserDTO {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}
