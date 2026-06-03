# FRONTEND PROMPT 03 — Site public dynamique
# Lire FRONTEND_MASTER_CONTEXT.md EN ENTIER avant de commencer
# FRONTEND_PROMPT_02 doit être complété avant

---

## MISSION
Brancher le site public sur l'API Spring Boot.
RÈGLE ABSOLUE : ne jamais réécrire les fichiers .html existants.
Ajouter UNIQUEMENT les directives Angular sur le HTML existant.

---

## ÉTAPE 1 — home-dark.component.ts

Lire home-dark.component.html ET home-dark.component.ts avant de modifier.

```typescript
@Component({
  selector: 'app-home-dark',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home-dark.component.html'
})
export class HomeDarkComponent implements OnInit, AfterViewInit {

  circuits: CircuitSummary[] = [];
  destinations: DestinationSummary[] = [];
  isLoadingCircuits = true;
  isLoadingDestinations = true;

  constructor(
    private circuitService: CircuitService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    this.circuitService.getFeatured().subscribe({
      next: (data) => { this.circuits = data; this.isLoadingCircuits = false; },
      error: () => { this.isLoadingCircuits = false; }
    });

    this.destinationService.getAll().subscribe({
      next: (page) => {
        this.destinations = page.content;
        this.isLoadingDestinations = false;
      },
      error: () => { this.isLoadingDestinations = false; }
    });
  }

  ngAfterViewInit(): void {
    // Initialiser Swiper, WOW, Jarallax — déjà en place dans le composant
    // Ne pas modifier cette méthode si elle existe déjà
  }

  getCircuitImage(circuit: CircuitSummary): string {
    return getImageUrl(circuit.coverImage, CIRCUIT_FALLBACK_IMAGES[circuit.slug]
      || 'assets/images/packages/p2-1.webp');
  }

  getDestinationImage(dest: DestinationSummary): string {
    return getImageUrl(dest.coverImage, DESTINATION_FALLBACK_IMAGES[dest.slug]
      || 'assets/images/destination/d1-1.webp');
  }
}
```

### Modifications dans home-dark.component.html

Sur la SECTION PACKAGES (circuits) :

AVANT (hardcodé) :
```html
<div class="package-card">
  <img src="assets/images/packages/p2-1.webp" alt="Mont Cameroun">
  <h3>Mont Cameroun</h3>
  <span>4 jours</span>
  <span>180 000 FCFA</span>
</div>
```

APRÈS (dynamique) :
```html
<!-- Skeleton loader pendant le chargement -->
<div *ngIf="isLoadingCircuits" class="...existing skeleton classes...">
  <!-- Garder le design du skeleton Arid si présent, sinon div vide -->
</div>

<!-- Données réelles -->
<ng-container *ngIf="!isLoadingCircuits">
  <div class="package-card" *ngFor="let circuit of circuits">
    <img [src]="getCircuitImage(circuit)" [alt]="circuit.title">
    <h3>{{circuit.title}}</h3>
    <span>{{circuit.daysCount}} jours</span>
    <span>{{circuit.price | number}} FCFA</span>
    <a [routerLink]="['/circuits', circuit.slug]">Voir le circuit</a>
  </div>
</ng-container>
```

Sur la SECTION DESTINATIONS :
```html
<div class="destination-card" *ngFor="let dest of destinations">
  <img [src]="getDestinationImage(dest)" [alt]="dest.name">
  <h3>{{dest.name}}</h3>
  <span>{{dest.circuitsCount}} circuits</span>
  <a [routerLink]="['/destinations', dest.slug]">Explorer</a>
</div>
```

---

## ÉTAPE 2 — circuit-list.component.ts

Lire circuit-list.component.html et circuit-list.component.ts avant de modifier.

```typescript
@Component({
  selector: 'app-circuit-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './circuit-list.component.html'
})
export class CircuitListComponent implements OnInit {

  circuits: CircuitSummary[] = [];
  totalPages = 0;
  currentPage = 0;
  isLoading = true;

  filters: CircuitSearchRequest = {
    page: 0,
    size: 9
  };

  constructor(
    private circuitService: CircuitService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Lire les query params (ex: ?category=SAFARI)
    this.route.queryParams.subscribe(params => {
      this.filters = { ...this.filters, ...params };
      this.loadCircuits();
    });
  }

  loadCircuits(): void {
    this.isLoading = true;
    this.circuitService.search(this.filters).subscribe({
      next: (page) => {
        this.circuits = page.content;
        this.totalPages = page.totalPages;
        this.currentPage = page.page;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onFilterChange(): void {
    this.filters.page = 0;
    this.loadCircuits();
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loadCircuits();
  }

  getCircuitImage(circuit: CircuitSummary): string {
    return getImageUrl(circuit.coverImage,
      CIRCUIT_FALLBACK_IMAGES[circuit.slug] || 'assets/images/packages/p1-1.webp');
  }
}
```

### Modifications dans circuit-list.component.html

Sur les selects de filtre (trouver les selects existants et ajouter [(ngModel)]) :
```html
<select [(ngModel)]="filters.category" (ngModelChange)="onFilterChange()">
  <option value="">Toutes catégories</option>
  <option value="SAFARI">Safari</option>
  <option value="TREKKING">Trekking</option>
  <option value="CULTURAL">Culturel</option>
  <option value="BEACH">Balnéaire</option>
  <option value="ECOTOURISM">Écotourisme</option>
</select>
```

Sur la grille des circuits :
```html
<div *ngIf="isLoading"><!-- skeleton --></div>
<div *ngFor="let circuit of circuits" class="...classes existantes...">
  <a [routerLink]="['/circuits', circuit.slug]">
    <img [src]="getCircuitImage(circuit)" [alt]="circuit.title">
  </a>
  <h3>{{circuit.title}}</h3>
  <span>{{circuit.daysCount}} j / {{circuit.nightsCount}} n</span>
  <span>{{circuit.price | number:'1.0-0'}} FCFA</span>
</div>

<!-- Pagination (garder le design Arid existant) -->
<button *ngFor="let p of [].constructor(totalPages); let i = index"
  (click)="goToPage(i)"
  [class.active]="i === currentPage">
  {{i + 1}}
</button>
```

---

## ÉTAPE 3 — circuit-detail.component.ts

Lire circuit-detail.component.html et circuit-detail.component.ts avant de modifier.

```typescript
@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './circuit-detail.component.html'
})
export class CircuitDetailComponent implements OnInit, AfterViewInit {

  circuit: CircuitDetail | null = null;
  departureDates: DepartureDate[] = [];
  isLoading = true;
  activeTab = 'overview';

  constructor(
    private route: ActivatedRoute,
    private circuitService: CircuitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.router.navigate(['/circuits']); return; }

    this.circuitService.getBySlug(slug).subscribe({
      next: (data) => {
        this.circuit = data;
        this.isLoading = false;
        this.loadDates(data.id);
      },
      error: () => this.router.navigate(['/circuits'])
    });
  }

  private loadDates(circuitId: string): void {
    this.circuitService.getDepartureDates(circuitId).subscribe({
      next: (dates) => this.departureDates = dates
    });
  }

  ngAfterViewInit(): void {
    // Swiper galerie : initialiser si présent dans le HTML
  }

  getMainImage(): string {
    return getImageUrl(this.circuit?.coverImage,
      this.circuit?.slug
        ? CIRCUIT_FALLBACK_IMAGES[this.circuit.slug]
        : 'assets/images/packages/p1-1.webp'
    );
  }

  setActiveTab(tab: string): void { this.activeTab = tab; }
  isActiveTab(tab: string): boolean { return this.activeTab === tab; }
}
```

### Modifications dans circuit-detail.component.html

Garder TOUT le HTML existant. Ajouter uniquement :

Sur le titre :
```html
<h1>{{circuit?.title || 'Chargement...'}}</h1>
```

Sur l'itinéraire (trouver la section et ajouter *ngFor) :
```html
<div *ngFor="let day of circuit?.itinerary"
  class="...classes existantes...">
  <span>Jour {{day.dayNumber}}</span>
  <h4>{{day.title}}</h4>
  <p>{{day.description}}</p>
</div>
```

Sur les inclus/exclus :
```html
<li *ngFor="let item of circuit?.includes">{{item}}</li>
<li *ngFor="let item of circuit?.excludes">{{item}}</li>
```

Sur les dates de départ :
```html
<option *ngFor="let d of departureDates"
  [value]="d.id"
  [disabled]="d.status === 'FULL'">
  {{d.departureDate | date:'dd/MM/yyyy'}}
  — {{d.availableSpots}} places
  <span *ngIf="d.status === 'FULL'">(Complet)</span>
</option>
```

---

## ÉTAPE 4 — destination-list.component (VIDE → créer depuis zéro)

```typescript
@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination-list.component.html'
})
export class DestinationListComponent implements OnInit {
  destinations: DestinationSummary[] = [];
  isLoading = true;

  constructor(private destinationService: DestinationService) {}

  ngOnInit(): void {
    this.destinationService.getAll().subscribe({
      next: (page) => { this.destinations = page.content; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  getImage(dest: DestinationSummary): string {
    return getImageUrl(dest.coverImage, DESTINATION_FALLBACK_IMAGES[dest.slug]
      || 'assets/images/destination/d1-1.webp');
  }
}
```

Pour destination-list.component.html :
Créer un template calqué sur le design Arid (package-list.html).
Breadcrumb en haut, grille de cards destinations, même structure que package-list.

Pour destination-detail.component.html (vide → créer) :
Breadcrumb + hero image + description + circuits liés.

---

## VALIDATION
[ ] Homepage charge les 6 circuits depuis l'API (ou fallback si API down)
[ ] Homepage charge les 5 destinations depuis l'API
[ ] Circuit list filtre par catégorie en appelant l'API
[ ] Circuit detail charge le bon circuit via son slug
[ ] Circuit detail affiche l'itinéraire jour par jour de l'API
[ ] Circuit detail affiche les dates de départ disponibles
[ ] Destinations list affiche les destinations de l'API
[ ] Si API down → images locales affichées (fallback)
[ ] Pagination fonctionne sur la liste circuits
