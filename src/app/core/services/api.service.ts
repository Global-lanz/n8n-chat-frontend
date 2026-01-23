import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UserResponse,
  UpdateUsernameRequest,
  Message,
  SendMessageRequest,
  AppConfig,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  VersionResponse
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  // Auth Endpoints
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data);
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/user/me`);
  }

  updateUsername(data: UpdateUsernameRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/user/username`, data);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/password`, data);
  }

  // Messages Endpoints
  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages`);
  }

  sendMessage(data: SendMessageRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/messages`, data);
  }

  // Config Endpoints
  getConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>(`${this.baseUrl}/config`);
  }

  getVersion(): Observable<VersionResponse> {
    return this.http.get<VersionResponse>(`${this.baseUrl}/version`);
  }

  // Admin Endpoints
  getUsers(): Observable<UsersListResponse> {
    return this.http.get<UsersListResponse>(`${this.baseUrl}/admin/users`);
  }

  createUser(data: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users`, data);
  }

  updateUser(userId: number, data: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${userId}`, data);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}`);
  }

  // Admin Messages Endpoints
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/admin/messages`);
  }

  getUserMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/admin/messages/${userId}`);
  }
}
