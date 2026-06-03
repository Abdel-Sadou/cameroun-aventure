# FRONTEND PROMPT 04 — Booking + Espace Client
# Lire FRONTEND_MASTER_CONTEXT.md EN ENTIER avant de commencer
# FRONTEND_PROMPT_03 doit être complété avant

---

## MISSION
1. Brancher le booking.component existant sur l'API réelle
   (sans supprimer le devis.service.ts existant)
2. Créer l'espace client (my-bookings, booking-detail, profile)

---

## ÉTAPE 1 — booking.component.ts

IMPORTANT : lire booking.component.html et booking.component.ts
AVANT de modifier. Le composant existant utilise DevisService
pour générer des PDFs côté client.

Stratégie : ajouter un mode "API booking" EN PLUS du devis PDF existant.
Le client peut soit faire un devis PDF (existant), soit réserver vraiment (nouveau).

```typescript
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {

  // Mode : 'devis' (existant) | 'booking' (nouveau avec API)
  mode: 'devis' | 'booking' = 'devis';

  // Données du circuit sélectionné (depuis query params)
  selectedCircuit: CircuitDetail | null = null;
  departureDates: DepartureDate[] = [];
  selectedDate: DepartureDate | null = null;

  // Participants dynamiques
  participants: ParticipantRequest[] = [this.emptyParticipant()];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private circuitService: CircuitService,
    private bookingService: BookingService,
    // Garder DevisService — ne pas le supprimer
    private devisService: DevisService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.queryParams['circuit'];
    if (slug) {
      this.mode = 'booking';
      this.circuitService.getBySlug(slug).subscribe({
        next: (circuit) => {
          this.selectedCircuit = circuit;
          this.circuitService.getDepartureDates(circuit.id).subscribe({
            next: (dates) => this.departureDates = dates.filter(d => d.status === 'OPEN')
          });
        }
      });
    }
  }

  addParticipant(): void {
    this.participants.push(this.emptyParticipant());
  }

  removeParticipant(index: number): void {
    if (this.participants.length > 1) this.participants.splice(index, 1);
  }

  private emptyParticipant(): ParticipantRequest {
    return { firstName: '', lastName: '' };
  }

  onSubmitBooking(): void {
    if (!this.selectedDate || this.participants.length === 0) return;
    this.isLoading = true;

    const request: BookingCreateRequest = {
      departureDateId: this.selectedDate.id,
      participants: this.participants,
    };

    this.bookingService.create(request).subscribe({
      next: (booking) => {
        this.isLoading = false;
        this.successMessage = `Réservation ${booking.bookingReference} créée !
          Vous allez être redirigé vers le paiement.`;
        // TODO Phase 2 : rediriger vers le paiement
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la réservation';
      }
    });
  }
}
```

### Modifications dans booking.component.html

GARDER tout le contenu existant (formulaire devis PDF).
AJOUTER au début un toggle mode si circuit sélectionné :

```html
<!-- Toggle mode (visible seulement si circuit sélectionné via query param) -->
<div *ngIf="selectedCircuit" class="...classes Tailwind...">
  <button (click)="mode='devis'"
    [class.active]="mode==='devis'">
    Demande de devis
  </button>
  <button (click)="mode='booking'"
    [class.active]="mode==='booking'">
    Réserver maintenant
  </button>
</div>

<!-- Mode booking (nouveau) -->
<div *ngIf="mode==='booking' && selectedCircuit">
  <h2>{{selectedCircuit.title}}</h2>

  <!-- Sélection date -->
  <select [(ngModel)]="selectedDate">
    <option [value]="null">Choisir une date</option>
    <option *ngFor="let d of departureDates" [ngValue]="d">
      {{d.departureDate | date:'dd/MM/yyyy'}}
      — {{d.availableSpots}} places disponibles
    </option>
  </select>

  <!-- Participants -->
  <div *ngFor="let p of participants; let i = index">
    <h4>Participant {{i + 1}}</h4>
    <input [(ngModel)]="p.firstName" placeholder="Prénom *">
    <input [(ngModel)]="p.lastName" placeholder="Nom *">
    <input [(ngModel)]="p.email" placeholder="Email">
    <input [(ngModel)]="p.phone" placeholder="Téléphone">
    <input [(ngModel)]="p.passportNumber" placeholder="N° Passeport">
    <button *ngIf="i > 0" (click)="removeParticipant(i)">Supprimer</button>
  </div>

  <button (click)="addParticipant()">+ Ajouter un participant</button>
  <button (click)="onSubmitBooking()" [disabled]="isLoading">
    {{isLoading ? 'En cours...' : 'Confirmer la réservation'}}
  </button>

  <div *ngIf="successMessage" class="success">{{successMessage}}</div>
  <div *ngIf="errorMessage" class="error">{{errorMessage}}</div>
</div>

<!-- Mode devis (existant — ne pas toucher) -->
<div *ngIf="mode==='devis'">
  <!-- Tout le contenu existant du formulaire de devis -->
</div>
```

---

## ÉTAPE 2 — Espace client (fichiers à créer depuis zéro)

### 2a — my-bookings.component

```typescript
// src/app/features/client-space/my-bookings.component.ts
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingSummary[] = [];
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (page) => { this.bookings = page.content; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'text-yellow-600 bg-yellow-50',
      'CONFIRMED': 'text-blue-600 bg-blue-50',
      'IN_PROGRESS': 'text-teal-600 bg-teal-50',
      'COMPLETED': 'text-green-600 bg-green-50',
      'CANCELLED': 'text-gray-500 bg-gray-50',
      'EXPIRED': 'text-red-500 bg-red-50',
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée',
      'EXPIRED': 'Expirée',
    };
    return labels[status] || status;
  }
}
```

Template my-bookings.component.html :
Design Arid — breadcrumb + tableau de réservations avec :
- Référence, circuit, date, statut coloré, total, bouton voir détail
- Lien vers /client-space/my-bookings/:reference pour chaque ligne
- Message "Aucune réservation" si liste vide

---

### 2b — booking-detail.component

```typescript
// src/app/features/client-space/booking-detail.component.ts
@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-detail.component.html'
})
export class BookingDetailComponent implements OnInit {
  booking: BookingDetail | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('reference');
    if (!ref) { this.router.navigate(['/client-space']); return; }

    this.bookingService.getByReference(ref).subscribe({
      next: (data) => { this.booking = data; this.isLoading = false; },
      error: () => this.router.navigate(['/client-space'])
    });
  }
}
```

Template booking-detail.component.html :
- Breadcrumb
- En-tête : référence, statut, circuit, dates
- Section participants : tableau avec noms et passeports
- Section paiements : historique (acompte, solde)
- Timeline simple (sera enrichie en Phase 2)
- Bouton "Annuler" si status PENDING ou CONFIRMED

---

### 2c — profile.component

```typescript
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: UserSummary | null = null;
  profileForm!: FormGroup;
  isLoading = false;
  successMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user;
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName, Validators.required],
      lastName: [this.user?.lastName, Validators.required],
      phone: [this.user?.phone],
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.http.put<ApiResponse<UserSummary>>(
      `${environment.apiUrl}/profile`,
      this.profileForm.value
    ).subscribe({
      next: () => { this.isLoading = false; this.successMessage = 'Profil mis à jour'; },
      error: () => { this.isLoading = false; }
    });
  }
}
```

Template profile.component.html :
Formulaire simple avec les champs du profil, photo, bouton enregistrer.

---

## VALIDATION
[ ] /booking?circuit=trekking-mont-cameroun → charge le circuit et les dates
[ ] Formulaire booking → crée une réservation via POST /api/v1/bookings
[ ] /client-space/my-bookings → liste les réservations du client connecté
[ ] Statuts affichés avec couleurs (jaune=pending, bleu=confirmed, vert=completed)
[ ] /client-space/my-bookings/:ref → affiche le détail de la réservation
[ ] /client-space/profile → affiche et modifie le profil
[ ] Si non connecté → redirect vers /auth
[ ] Devis PDF existant (booking.component mode devis) → fonctionne toujours
