# FRONTEND PROMPT 01 — Core Setup
# Lire FRONTEND_MASTER_CONTEXT.md EN ENTIER avant de commencer
 
---

## MISSION
Mettre en place toute la fondation Angular :
environnement, models, services, interceptors, guards.
NE PAS TOUCHER aux composants existants dans cette étape.

---

## ÉTAPE 1 — Environments

Créer les deux fichiers :
- src/environments/environment.ts
- src/environments/environment.prod.ts
Contenu exact dans la section 4 de FRONTEND_MASTER_CONTEXT.

---

## ÉTAPE 2 — Modèles TypeScript

Créer dans src/app/core/models/ :
- auth.model.ts
- circuit.model.ts
- destination.model.ts
- booking.model.ts
- api-response.model.ts

Contenu exact dans la section 5 de FRONTEND_MASTER_CONTEXT.
Un fichier par domaine.

---

## ÉTAPE 3 — Storage Service

```typescript
// src/app/core/services/storage.service.ts
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'ca_access_token';
  private readonly REFRESH_KEY = 'ca_refresh_token';
  private readonly USER_KEY = 'ca_user';

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }
  getAccessToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  getRefreshToken(): string | null { return localStorage.getItem(this.REFRESH_KEY); }
  setUser(user: any): void { localStorage.setItem(this.USER_KEY, JSON.stringify(user)); }
  getUser(): any {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }
  isLoggedIn(): boolean { return !!this.getAccessToken(); }
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
```

---

## ÉTAPE 4 — Auth Service

```typescript
// src/app/core/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUser = signal<UserSummary | null>(null);

  constructor(private http: HttpClient, private storage: StorageService) {
    const saved = this.storage.getUser();
    if (saved) this.currentUser.set(saved);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, req)
      .pipe(
        map(r => r.data),
        tap(data => {
          this.storage.setTokens(data.accessToken, data.refreshToken);
          this.storage.setUser(data.user);
          this.currentUser.set(data.user);
        })
      );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, req)
      .pipe(map(r => r.data), tap(data => {
        this.storage.setTokens(data.accessToken, data.refreshToken);
        this.storage.setUser(data.user);
        this.currentUser.set(data.user);
      }));
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.storage.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/refresh`, { refreshToken: token }
    ).pipe(map(r => r.data), tap(data => {
      this.storage.setTokens(data.accessToken, data.refreshToken);
    }));
  }

  get user(): UserSummary | null { return this.currentUser(); }
  get isLoggedIn(): boolean { return !!this.currentUser(); }
  get userSignal() { return this.currentUser.asReadonly(); }
}
```

---

## ÉTAPE 5 — Circuit Service

```typescript
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
```

---

## ÉTAPE 6 — Destination Service

```typescript
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
```

---

## ÉTAPE 7 — Booking Service

```typescript
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
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/cancel`,
      { body: { reason } }
    ).pipe(map(() => void 0));
  }
}
```

---

## ÉTAPE 8 — JWT Interceptor

```typescript
// src/app/core/interceptors/jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getAccessToken();

  const isAuthEndpoint = req.url.includes('/auth/login')
    || req.url.includes('/auth/register')
    || req.url.includes('/auth/refresh');

  if (token && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

---

## ÉTAPE 9 — Error Interceptor

```typescript
// src/app/core/interceptors/error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        inject(StorageService).clear();
        router.navigate(['/auth'], {
          queryParams: { redirect: router.url }
        });
      }
      if (error.status === 403) {
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
```

---

## ÉTAPE 10 — Auth Guard

```typescript
// src/app/core/guards/auth.guard.ts
export const AuthGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  if (storage.isLoggedIn()) return true;
  return router.createUrlTree(['/auth'], {
    queryParams: { redirect: state.url }
  });
};
```

---

## ÉTAPE 11 — Image Utils

Créer src/app/core/utils/image.utils.ts
Contenu exact dans la section 8 et 9 de FRONTEND_MASTER_CONTEXT.

---

## ÉTAPE 12 — App Config (app.config.ts)

Mettre à jour app.config.ts pour inclure :
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    provideAnimations()
  ]
};
```

---

## VALIDATION
[ ] ng serve → compile sans erreur
[ ] StorageService : set/get token fonctionne
[ ] AuthService : login() appelle POST /api/v1/auth/login
[ ] CircuitService : getFeatured() appelle GET /api/v1/circuits/featured
[ ] JWT Interceptor ajoute le header sur les requêtes protégées
[ ] Error Interceptor redirige vers /auth sur 401
