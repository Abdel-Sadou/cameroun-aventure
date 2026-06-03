# FRONTEND MASTER CONTEXT — Cameroun Aventure
# Référence absolue pour tous les prompts Claude Code frontend
# Lire EN ENTIER avant de générer quoi que ce soit

---

## 1. CONTEXTE PROJET

```
Client    : Cameroun Aventure (gotocameroon.org) — agence de voyage Yaoundé
Frontend  : Angular 21 standalone components + Tailwind CSS V3
Template  : Arid Travel & Tourism (acheté ThemeForest)
Backend   : Spring Boot 3.x opérationnel sur http://localhost:8080
```

---

## 2. CE QUI EXISTE DÉJÀ — NE PAS RECRÉER

```
✅ theme.service.ts          — light/dark switcher opérationnel
✅ devis.service.ts          — génération PDF devis côté client (15KB, garder intact)
✅ layout.component.html     — contient header + router-outlet + footer (415 lignes)
✅ layout.component.ts       — logique sticky, mobile menu, dropdown
✅ home-dark.component.html  — homepage avec contenu Cameroun Aventure (55KB)
✅ circuit-detail.component.html — détail Mont Cameroun avec itinéraire (48KB)
✅ booking.component.html    — formulaire de devis PDF (22KB)
✅ about.component.html      — page à propos (25KB)
✅ app.routes.ts             — routes configurées avec lazy loading
✅ styles.css                — Tailwind + Arid input.css
```

```
⚠️  header/footer dans layout.component.html → à extraire vers leurs composants
⚠️  header.component.html (17KB)  — contenu Arid original, non utilisé
⚠️  footer.component.html (13KB)  — contenu Arid original, non utilisé
⚠️  destination-list.component.html (88 octets) — vide
⚠️  destination-detail.component.html (90 octets) — vide
⚠️  auth.component.html (76 octets) — vide
```

---

## 3. RÈGLE ABSOLUE — FICHIERS EXISTANTS

```
POUR CHAQUE COMPOSANT EXISTANT (non vide) :
  1. Lire le fichier .html ET le .ts actuels AVANT toute modification
  2. NE JAMAIS réécrire un fichier .html existant depuis zéro
  3. NE JAMAIS supprimer de contenu HTML existant
  4. UNIQUEMENT ajouter sur le .html : *ngFor, *ngIf, {{}}, [], ()
  5. UNIQUEMENT ajouter sur le .ts : injections, méthodes, observables

POUR LES FICHIERS VIDES (destination, auth) :
  → Créer normalement depuis zéro

FICHIERS INTOUCHABLES :
  → theme.service.ts (ne pas modifier)
  → devis.service.ts (ne pas modifier)
  → styles.css (ne pas modifier)
```

---

## 4. ENVIRONNEMENT

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  uploadUrl: 'http://localhost:8080/uploads'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.gotocameroon.org/api/v1',
  uploadUrl: 'https://api.gotocameroon.org/uploads'
};
```

---

## 5. MODÈLES TYPESCRIPT — Correspondance exacte avec les DTOs backend

```typescript
// src/app/core/models/

// ─── Auth ───
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserSummary;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  roleName: string;
}

// ─── Circuit ───
export interface CircuitSummary {
  id: string;
  title: string;
  slug: string;
  price: number;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';
  daysCount: number;
  nightsCount: number;
  category: string;
  coverImage: string;
  region: string;
  featured: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface CircuitDetail extends CircuitSummary {
  description: string;
  shortDescription: string;
  minAge?: number;
  maxAge?: number;
  minParticipants: number;
  maxParticipants: number;
  tags: string[];
  images: string[];
  includes: string[];
  excludes: string[];
  country: string;
  latitude?: number;
  longitude?: number;
  itinerary: ItineraryDay[];
  destination?: DestinationSummary;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
  activities?: string;
}

export interface CircuitSearchRequest {
  category?: string;
  difficulty?: string;
  region?: string;
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  search?: string;
  page?: number;
  size?: number;
}

// ─── Destination ───
export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  coverImage: string;
  circuitsCount: number;
}

export interface DestinationDetail extends DestinationSummary {
  description: string;
  practicalInfo?: string;
  bestTimeToVisit?: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}

// ─── Departure Date ───
export interface DepartureDate {
  id: string;
  departureDate: string;
  returnDate: string;
  minParticipants: number;
  maxParticipants: number;
  availableSpots: number;
  status: 'OPEN' | 'FULL' | 'WAITLIST' | 'CLOSED';
  season: 'HIGH' | 'LOW' | 'NORMAL';
  priceOverride?: number;
}

// ─── Booking ───
export interface BookingCreateRequest {
  departureDateId: string;
  participants: ParticipantRequest[];
  options?: string[];
  promoCode?: string;
  specialRequests?: string;
}

export interface ParticipantRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dietaryRestrictions?: string;
  roomPreference?: string;
}

export interface BookingSummary {
  id: string;
  bookingReference: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  circuitTitle: string;
  departureDate: string;
  participantsCount: number;
  createdAt: string;
}

export interface BookingDetail extends BookingSummary {
  departureDate: DepartureDate;
  participants: ParticipantRequest[];
  payments: PaymentSummary[];
  options: string[];
  expiresAt?: string;
  confirmedAt?: string;
}

// ─── Payment ───
export interface PaymentSummary {
  type: string;
  status: string;
  amount: number;
  paidAt?: string;
}

// ─── API Response wrapper ───
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

---

## 6. SERVICES À CRÉER

```typescript
// src/app/core/services/

auth.service.ts         // login, register, logout, profil
circuit.service.ts      // search, getBySlug, getFeatured
destination.service.ts  // getAll, getBySlug
departure.service.ts    // getByCircuit
booking.service.ts      // create, getMyBookings, getByReference, cancel
payment.service.ts      // initiate
storage.service.ts      // localStorage : token, user, theme
```

---

## 7. INTERCEPTORS & GUARDS

```typescript
// JWT Interceptor — ajoute automatiquement le token
// src/app/core/interceptors/jwt.interceptor.ts
// Ajoute Authorization: Bearer {token} sur toutes les requêtes
// Exclure : /auth/login, /auth/register, /auth/refresh

// Error Interceptor — gère les erreurs HTTP
// src/app/core/interceptors/error.interceptor.ts
// 401 → rediriger vers /auth?redirect=currentUrl
// 403 → rediriger vers /
// 500 → afficher toast d'erreur

// Auth Guard
// src/app/core/guards/auth.guard.ts
// Protéger : /client-space/**, /profile
// Rediriger vers /auth si non connecté

// Role Guard
// src/app/core/guards/role.guard.ts
// Protéger les routes admin (future Phase admin)
```

---

## 8. IMAGE FALLBACK — Stratégie obligatoire

```typescript
// Utilitaire pour toutes les images
// src/app/core/utils/image.utils.ts

export function getImageUrl(
  apiUrl: string | null | undefined,
  localFallback: string
): string {
  if (!apiUrl) return localFallback;
  if (apiUrl.startsWith('http')) return apiUrl;
  if (apiUrl.startsWith('/uploads')) {
    return environment.uploadUrl + apiUrl.replace('/uploads', '');
  }
  return localFallback;
}

// Utilisation dans les templates :
// [src]="getImageUrl(circuit.coverImage, 'assets/images/packages/p1-1.webp')"
```

---

## 9. MAPPING IMAGE → CIRCUIT (fallbacks locaux)

```typescript
// Images locales vérifiées dans le projet Angular
export const CIRCUIT_FALLBACK_IMAGES: Record<string, string> = {
  'trekking-mont-cameroun':         'assets/images/packages/p2-1.webp',
  'kribi-chutes-lobe-ocean':        'assets/images/packages/p2-2.webp',
  'safari-parc-waza-grand-nord':    'assets/images/packages/p2-3.webp',
  'pays-bamileke-foumban-royaumes': 'assets/images/packages/p2-4.webp',
  'grand-nord-monts-mandara':       'assets/images/packages/p1-5.webp',
  'foret-dja-peuples-baka':         'assets/images/packages/p1-4.webp',
  'douala-limbe-cote-atlantique':   'assets/images/packages/p1-7.webp',
  'ngaoundere-hauts-plateaux':      'assets/images/packages/p1-8.webp',
  'yaounde-culturel-musees':        'assets/images/packages/p1-9.webp',
};

export const DESTINATION_FALLBACK_IMAGES: Record<string, string> = {
  'est-cameroun':         'assets/images/destination/d1-1.webp',
  'grand-nord':           'assets/images/destination/d1-2.webp',
  'littoral-mont-cameroun': 'assets/images/destination/d1-3.webp',
  'grand-ouest':          'assets/images/destination/d1-4.webp',
  'sud-cameroun':         'assets/images/destination/d1-5.webp',
};
```

---

## 10. PANIER (CART) — Décision prise

Le panier Arid (Cart icon dans le header) est **supprimé**.
Le remplacer par les icônes : ❤️ Favoris + 👤 Connexion/Profil.

---

## 11. ROUTES MISES À JOUR

```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home-dark.component') },
      { path: 'about', loadComponent: () => import('./features/about/about.component') },
      { path: 'circuits', loadComponent: () => import('./features/circuits/circuit-list.component') },
      { path: 'circuits/:slug', loadComponent: () => import('./features/circuits/circuit-detail.component') },
      { path: 'destinations', loadComponent: () => import('./features/destinations/destination-list.component') },
      { path: 'destinations/:slug', loadComponent: () => import('./features/destinations/destination-detail.component') },
      { path: 'booking', loadComponent: () => import('./features/booking/booking.component') },
      { path: 'guides', loadComponent: () => import('./features/guides/guide-list.component') },
      { path: 'gallery', loadComponent: () => import('./features/gallery/gallery.component') },
      { path: 'blog', loadComponent: () => import('./features/blog/blog-list.component') },
      { path: 'blog/:slug', loadComponent: () => import('./features/blog/blog-detail.component') },
      { path: 'faq', loadComponent: () => import('./features/faq/faq.component') },
      { path: 'contact', loadComponent: () => import('./features/contact/contact.component') },
      {
        path: 'client-space',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'my-bookings', pathMatch: 'full' },
          { path: 'my-bookings', loadComponent: () => import('./features/client-space/my-bookings.component') },
          { path: 'my-bookings/:reference', loadComponent: () => import('./features/client-space/booking-detail.component') },
          { path: 'profile', loadComponent: () => import('./features/client-space/profile.component') },
        ]
      },
      { path: 'auth', loadComponent: () => import('./features/auth/auth.component') },
      { path: '**', loadComponent: () => import('./features/not-found/not-found.component') },
    ]
  }
];
```

---

## 12. CONTACTS RÉELS DU CLIENT

```
Nom          : Cameroun Aventure
Slogan       : Toute l'Afrique dans un pays
Tel          : (+237) 6 52 71 55 40
WhatsApp     : (+237) 694 37 21 78
Email        : camerounaventure@yahoo.fr
Adresse      : Immeuble La Paix Mokolo, 1er étage, Porte 115, Yaoundé
Copyright    : © 2025 Cameroun Aventure. Tous droits réservés.
```

---

## INSTRUCTION FINALE POUR CLAUDE CODE

1. Lire CE FICHIER + les fichiers existants AVANT de générer
2. Ne jamais réécrire un .html existant non vide depuis zéro
3. Utiliser TOUJOURS la stratégie fallback image (section 8)
4. Ne jamais modifier theme.service.ts ni devis.service.ts
5. Toutes les réponses API sont wrappées dans ApiResponse<T>
6. Les listes paginées retournent PageResponse<T>
