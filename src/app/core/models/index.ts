// User Model
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  licenseExpiresAt: string | null;
  createdAt: string;
}

// Auth Models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Message Models
export interface Message {
  id?: number;
  user_id?: number;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface SendMessageRequest {
  content: string;
}

// Admin Models
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  licenseExpiresAt?: string | null;
  isAdmin?: boolean;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  licenseExpiresAt?: string | null;
  isAdmin?: boolean;
  isActive?: boolean;
}

// Config Models
export interface AppConfig {
  botName: string;
}

// API Response Models
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

export interface UsersListResponse {
  users: User[];
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UserResponse {
  user: User;
}

export interface VersionResponse {
  version: string;
}
