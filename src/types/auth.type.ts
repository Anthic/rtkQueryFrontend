export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  StatusCodes?: number;
}

export interface UpdatePasswordResquest {
  oldPassword: string;
  newPassword: string;
}
