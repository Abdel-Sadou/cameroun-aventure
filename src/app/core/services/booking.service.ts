import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { BookingCreateRequest, BookingDetail, BookingSummary } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = environment.apiUrl + '/bookings';

  constructor(private http: HttpClient) {}

  create(req: BookingCreateRequest): Observable<BookingDetail> {
    return this.http.post<ApiResponse<BookingDetail>>(this.apiUrl, req)
      .pipe(map(r => r.data));
  }

  getMyBookings(page = 0, size = 10): Observable<PageResponse<BookingSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<BookingSummary>>>(
      `${this.apiUrl}/my`, { params }
    ).pipe(map(r => r.data));
  }

  getByReference(reference: string): Observable<BookingDetail> {
    return this.http.get<ApiResponse<BookingDetail>>(`${this.apiUrl}/${reference}`)
      .pipe(map(r => r.data));
  }

  cancel(id: string, reason: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}/cancel`, { body: { reason } }
    ).pipe(map(() => void 0));
  }
}
