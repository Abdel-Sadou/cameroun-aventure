# FRONTEND PROMPT 02 — Layout Refactoring + Auth
# Lire FRONTEND_MASTER_CONTEXT.md EN ENTIER avant de commencer
# FRONTEND_PROMPT_01 doit être complété avant

---

## MISSION
1. Extraire header et footer de layout.component.html
   vers leurs composants dédiés
2. Mettre à jour les contacts et navigation (Cameroun Aventure)
3. Supprimer le panier Cart → remplacer par Favoris + Connexion
4. Créer la page d'authentification

---

## ÉTAPE 1 — Extraire le Header depuis layout.component.html

### 1a — Lire layout.component.html AVANT de toucher
Le header se trouve entre les commentaires
<!-- HEADER STYLE ONE START --> et <!-- HEADER STYLE ONE END -->
Il contient la navigation desktop, mobile menu, sticky logic.

### 1b — Copier dans header.component.html
Couper exactement le bloc header (lignes 5..207) de layout.component.html
et le coller dans header.component.html.

### 1c — Déplacer la logique TypeScript vers header.component.ts
Les propriétés et méthodes suivantes viennent de layout.component.ts
et doivent être déplacées dans header.component.ts :

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  // Depuis layout.component.ts
  isScrolled = false;
  isMobileMenuOpen = false;
  isDropdownOpen: Record<string, boolean> = {};

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 50; }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(key: string): void {
    this.isDropdownOpen[key] = !this.isDropdownOpen[key];
  }

  get isDark(): boolean { return this.themeService.isDarkMode; }
  toggleTheme(): void { this.themeService.toggle(); }

  get currentUser() { return this.authService.user; }
  get isLoggedIn(): boolean { return this.authService.isLoggedIn; }
  logout(): void { this.authService.logout(); }
}
```

### 1d — Modifications dans header.component.html

SUPPRIMER (trouver et retirer) :
- Le bloc Cart/Panier complet (chercher "Cart" ou panier icon)
- Tout `<a>` ou `<button>` lié au panier

REMPLACER par (dans la zone des icônes à droite du header) :
```html
<!-- Favoris -->
<a routerLink="/circuits" class="...existing classes...">
  <i class="ti ti-heart"></i>
</a>

<!-- Toggle dark/light -->
<button (click)="toggleTheme()" class="...existing classes...">
  <i class="ti ti-sun" *ngIf="isDark"></i>
  <i class="ti ti-moon" *ngIf="!isDark"></i>
</button>

<!-- Connexion / Profil -->
<a *ngIf="!isLoggedIn" routerLink="/auth" class="...existing classes...">
  <i class="ti ti-user"></i>
</a>
<a *ngIf="isLoggedIn" routerLink="/client-space" class="...existing classes...">
  <i class="ti ti-dashboard"></i>
</a>
```

METTRE À JOUR la navigation (méga-dropdown destinations) :
Remplacer les destinations Arid (New York, London, etc.) par :
```
Est Cameroun  | Grand Nord   | Littoral & Mont Cameroun
Grand Ouest   | Sud Cameroun | Tchad | Gabon
```

---

## ÉTAPE 2 — Extraire le Footer depuis layout.component.html

### 2a — Copier dans footer.component.html
Couper le bloc footer (lignes 279..413) de layout.component.html
et le coller dans footer.component.html.

### 2b — Mettre à jour le contenu Cameroun Aventure en modifiant ce qui manque

Liens rapides :
```
Circuits Cameroun → /circuits
Destinations      → /destinations
Week-ends         → /circuits?category=CUSTOM
Galerie           → /gallery
Blog              → /blog
FAQ               → /faq
Contact           → /contact
```



Réseaux sociaux : garder les icônes existantes mais supprimer les URLs Arid.

---

## ÉTAPE 3 — Mettre à jour layout.component.html

Après extraction, layout.component.html doit contenir UNIQUEMENT :

```html
<app-preloader />
<app-header />
<main>
  <router-outlet />
</main>
<app-footer />
```

Mettre à jour layout.component.ts :
- Supprimer toutes les propriétés déplacées vers HeaderComponent
- Garder uniquement ce qui est propre au layout général

---

## ÉTAPE 4 — Page Auth

### Approche experte : copier auth.html d'Arid, convertir jQuery → Angular

Arid fournit auth.html  cherche dans le repertoire /arid-original avec un design complet et cohérent avec le reste du site.
La règle est de copier ce fichier tel quel, comme pour toutes les autres pages.
NE PAS créer depuis zéro.

### 4a — Lire arid-original/arid-main/dist/auth.html en entier

Ce fichier contient :
- Fond plein écran : image h4.webp + overlay noir
- Card blanche centrée (max-w-[550px])
- 2 onglets jQuery (tab-link, data-tab) : Sign In / Sign Up
- Champs : email, password, name (Sign Up), checkboxes
- Classes Arid : input_style__primary, btn_primary__v1, login-tabs, tab-content

### 4b — Copier dans auth.component.html

Copier TOUT le contenu HTML de arid-original/arid-main/dist/auth.html
dans auth.component.html.
Corriger les chemins assets : `./assets/` → `assets/`

### 4c — Convertir jQuery tabs → Angular dans auth.component.html

Remplacer le système jQuery (data-tab, tab-link, tab-content) par Angular :

```html
<!-- AVANT (jQuery) -->
<ul id="tabs-nav" class="login-tabs flex gap-4 pt-6">
  <li class="tab-link active basis-1/2" data-tab="1">Sign In</li>
  <li class="tab-link basis-1/2" data-tab="2">Sign Up</li>
</ul>
<div id="tab-1" class="tab-content active">...</div>
<div id="tab-2" class="tab-content">...</div>

<!-- APRÈS (Angular) — garder TOUTES les classes CSS existantes -->
<ul class="login-tabs flex gap-4 pt-6">
  <li class="tab-link basis-1/2"
    [class.active]="activeTab === 'login'"
    (click)="setTab('login')">Connexion</li>
  <li class="tab-link basis-1/2"
    [class.active]="activeTab === 'register'"
    (click)="setTab('register')">Inscription</li>
</ul>
<div class="tab-content" [class.active]="activeTab === 'login'">
  <!-- Formulaire login — contenu original Arid -->
</div>
<div class="tab-content" [class.active]="activeTab === 'register'">
  <!-- Formulaire register — contenu original Arid -->
</div>
```

### 4d — Ajouter les formGroups sur les inputs existants

```html
<!-- AVANT (Arid brut) -->
<input type="email" placeholder="Email or Username" class="input_style__primary">
<input type="password" placeholder="Your Password" class="input_style__primary">

<!-- APRÈS (Angular Reactive Forms — garder les classes existantes) -->
<form [formGroup]="loginForm" (ngSubmit)="onLogin()">
  <input type="email" placeholder="Email" class="input_style__primary"
    formControlName="email">
  <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
    class="text-red-500 text-sm mt-1">Email requis</div>

  <input type="password" placeholder="Mot de passe" class="input_style__primary"
    formControlName="password">

  <button type="submit" class="btn_primary__v1 uppercase !w-full justify-center lg:mt-5 mt-4"
    [disabled]="isLoading">
    <span *ngIf="!isLoading">Connexion</span>
    <span *ngIf="isLoading">Connexion en cours...</span>
    <!-- Garder le SVG arrow original d'Arid -->
  </button>

  <div *ngIf="errorMessage" class="text-red-500 text-center mt-3">
    {{errorMessage}}
  </div>
</form>
```

### 4e — auth.component.ts

```typescript
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {

  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: ['']
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/client-space']);
    }
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParams['redirect'] || '/client-space';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value as RegisterRequest).subscribe({
      next: () => this.router.navigate(['/client-space']),
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}
```

### Résultat attendu
La page /auth aura exactement le même design qu'auth.html d'Arid :
fond image h4.webp, card blanche centrée, onglets Sign In / Sign Up.
Seule la logique jQuery est remplacée par Angular.

---

## VALIDATION
[ ] Header extrait de layout → <app-header /> dans layout fonctionne
[ ] Footer extrait de layout → <app-footer /> dans layout fonctionne
[ ] layout.component.html contient seulement 4 lignes
[ ] Panier/Cart supprimé du header
[ ] Navigation mega-dropdown : destinations Cameroun
[ ] Contacts footer : Mokolo Yaoundé, +237 652...
[ ] Toggle dark/light dans le header
[ ] Connexion/Profil icon dans le header
[ ] Page /auth : formulaire login fonctionne
[ ] Page /auth : formulaire register fonctionne
[ ] Redirection vers /client-space après login réussi
