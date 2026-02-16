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
  email: string;           // "test10@example.com"
  password: string;        // "" - but should be required
  firstName: string;       // "John"
  lastName: string;        // "Doe"
  phoneNumber: string;     // "gdfgdf" - should validate numbers
  address: string;         // "123 Main St"
  // Optional fields agar aapke backend mein hain
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}