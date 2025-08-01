export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImagePath?: string;
  createdAt?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImagePath?: string;
}

export interface AuthResponse {
  fullName: string;
  email: string;
  token: string;
} 