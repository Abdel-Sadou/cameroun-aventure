import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest, UserSummary } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUser = signal<UserSummary | null>(null);

  constructor(private http: HttpClient, private storage: StorageService) {
    const saved = this.storage.getUser();
    if (saved) this.currentUser.set(saved);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, req).pipe(
      map(r => r.data),
      tap(data => {
        this.storage.setTokens(data.accessToken, data.refreshToken);
        this.storage.setUser(data.user);
        this.currentUser.set(data.user);
      })
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, req).pipe(
      map(r => r.data),
      tap(data => {
        this.storage.setTokens(data.accessToken, data.refreshToken);
        this.storage.setUser(data.user);
        this.currentUser.set(data.user);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.storage.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/refresh`, { refreshToken: token }
    ).pipe(
      map(r => r.data),
      tap(data => this.storage.setTokens(data.accessToken, data.refreshToken))
    );
  }

  get user(): UserSummary | null { return this.currentUser(); }
  get isLoggedIn(): boolean { return !!this.currentUser(); }
  get userSignal() { return this.currentUser.asReadonly(); }
}
