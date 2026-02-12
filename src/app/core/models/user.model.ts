export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
  theme?: 'light' | 'dark';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}