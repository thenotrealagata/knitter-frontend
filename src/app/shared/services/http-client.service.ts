import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from '../../charts/model/Chart';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  http: HttpClient;

  baseUrl = 'http://localhost:8080/api';

  constructor(http: HttpClient) {
    this.http = http;
   }

  getCharts(): Observable<Chart[]> {
    return this.http.get<Chart[]>(`${this.baseUrl}/charts`);
  }

  getChartById(id: number): Observable<Chart> {
    return this.http.get<Chart>(`${this.baseUrl}/charts/${id}`);
  }
}
