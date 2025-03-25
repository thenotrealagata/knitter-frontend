import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from '../../model/Chart';
import { AuthenticationRequest, User } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  http: HttpClient;

  baseUrl = 'http://localhost:8080/api';

  constructor(http: HttpClient) {
    this.http = http;
   }

  // Charts
  getCharts(): Observable<Chart[]> {
    return this.http.get<Chart[]>(`${this.baseUrl}/charts`);
  }

  getChartById(id: number): Observable<Chart> {
    return this.http.get<Chart>(`${this.baseUrl}/charts/${id}`);
  }

  createChart(chart: Chart): Observable<Chart> {
    console.log('chart create', chart);
    return this.http.post<Chart>(`${this.baseUrl}/charts`, chart);
  }

  // Authentication/users
  login(user: AuthenticationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/login`, user);
  }

  register(user: AuthenticationRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, user);
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${username}`);
  }

  addFavorite(username: string, chartId: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/${username}/favorites/${chartId}`, null);
  }

  removeFavorite(username: string, chartId: number): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${username}/favorites/${chartId}`);
  }

  // Image upload
  uploadImage(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/images`,
      formData,
      {
        headers: {
          'enctype': 'multipart/form-data'
        }
      }
    );
  }

  getImage(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/images/${fileName}`, {
      responseType: "blob"
    });
  }
}
