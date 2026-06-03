import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { DestinationDetail, DestinationSummary } from '../models/destination.model';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private apiUrl = environment.apiUrl + '/destinations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PageResponse<DestinationSummary>> {
    return this.http.get<ApiResponse<PageResponse<DestinationSummary>>>(this.apiUrl)
      .pipe(map(r => r.data));
  }

  getBySlug(slug: string): Observable<DestinationDetail> {
    return this.http.get<ApiResponse<DestinationDetail>>(`${this.apiUrl}/${slug}`)
      .pipe(map(r => r.data));
  }
}
