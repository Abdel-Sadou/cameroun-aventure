import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { CircuitDetail, CircuitSearchRequest, CircuitSummary, DepartureDate } from '../models/circuit.model';

@Injectable({ providedIn: 'root' })
export class CircuitService {
  private apiUrl = environment.apiUrl + '/circuits';

  constructor(private http: HttpClient) {}

  search(params: CircuitSearchRequest): Observable<PageResponse<CircuitSummary>> {
    const httpParams = new HttpParams({ fromObject: params as any });
    return this.http.get<ApiResponse<PageResponse<CircuitSummary>>>(
      this.apiUrl, { params: httpParams }
    ).pipe(map(r => r.data));
  }

  getBySlug(slug: string): Observable<CircuitDetail> {
    return this.http.get<ApiResponse<CircuitDetail>>(`${this.apiUrl}/${slug}`)
      .pipe(map(r => r.data));
  }

  getFeatured(): Observable<CircuitSummary[]> {
    return this.http.get<ApiResponse<CircuitSummary[]>>(`${this.apiUrl}/featured`)
      .pipe(map(r => r.data));
  }

  getDepartureDates(circuitId: string): Observable<DepartureDate[]> {
    return this.http.get<ApiResponse<DepartureDate[]>>(
      `${environment.apiUrl}/circuits/${circuitId}/departures`
    ).pipe(map(r => r.data));
  }
}
