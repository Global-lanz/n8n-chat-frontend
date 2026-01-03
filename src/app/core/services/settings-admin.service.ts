import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingDto {
  value: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsAdminService {
  private apiUrl = `${environment.apiUrl}/admin/settings`;

  constructor(private http: HttpClient) {}

  getAllSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.apiUrl);
  }

  getSetting(key: string): Observable<Setting> {
    return this.http.get<Setting>(`${this.apiUrl}/${key}`);
  }

  updateSetting(key: string, data: UpdateSettingDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${key}`, data);
  }

  deleteSetting(key: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${key}`);
  }
}
