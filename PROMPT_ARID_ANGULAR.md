
# PROMPT CLAUDE CODE — Conversion Arid HTML → Angular 21
# Projet : Cameroun Aventure | Phase : Intégration template (SANS modification de contenu)
# À coller dans le terminal IntelliJ avec Claude Code

---

## MISSION

Convertir le template HTML/Tailwind CSS "Arid - Travel & Tourism" en projet
Angular 21 standalone. Le contenu original d'Arid doit rester INTACT —
textes, images, liens, données hardcodées : ne rien changer.
La modification du contenu sera faite dans une phase ultérieure.

---

## STRUCTURE DU ZIP (déjà extrait dans arid-original/)

```
arid-original/
├── arid-main/
│   ├── src/
│   │   └── input.css          ← SOURCE Tailwind (704 lignes, 147 @apply)
│   ├── dist/
│   │   ├── assets/
│   │   │   ├── css/           ← Tous les CSS (animate, swiper, leaflet...)
│   │   │   ├── fonts/         ← bootstrap-icons.woff/woff2
│   │   │   ├── images/        ← Toutes les images .webp/.png
│   │   │   └── js/            ← swiper, jarallax, wow, fancybox, leaflet...
│   │   └── *.html             ← 20 pages HTML
│   ├── tailwind.config.js
│   └── package.json
└── documentation/             ← Ignorer complètement
```

---

## PAGES À CONVERTIR (composants Angular correspondants)

```
arid-main/dist/index.html              → features/home/home.component
arid-main/dist/about.html             → features/about/about.component
arid-main/dist/package-list.html      → features/circuits/circuit-list.component
arid-main/dist/package-list-sidebar.html → features/circuits/circuit-list-sidebar.component
arid-main/dist/package-details.html   → features/circuits/circuit-detail.component
arid-main/dist/package-details-2.html → features/circuits/circuit-detail-2.component
arid-main/dist/package-details-3.html → features/circuits/circuit-detail-3.component
arid-main/dist/destination.html       → features/destinations/destination-list.component
arid-main/dist/destination-details.html → features/destinations/destination-detail.component
arid-main/dist/booking.html           → features/booking/booking.component
arid-main/dist/guide.html             → features/guides/guide-list.component
arid-main/dist/gallery.html           → features/gallery/gallery.component
arid-main/dist/blog-list.html         → features/blog/blog-list.component
arid-main/dist/blog-details.html      → features/blog/blog-detail.component
arid-main/dist/faq.html               → features/faq/faq.component
arid-main/dist/auth.html              → features/auth/auth.component
arid-main/dist/contact.html           → features/contact/contact.component
arid-main/dist/error.html             → features/not-found/not-found.component
arid-main/dist/index-2.html           → features/home/home-dark.component
arid-main/dist/index-3.html           → features/home/home-parallax.component
```

---

## SECTIONS DE LA HOMEPAGE (index.html) — DANS L'ORDRE EXACT

```
Ligne  30-39   → PreloaderComponent  (shared)
Ligne  41-308  → HeaderComponent     (shared)
Ligne 310-530  → Section hero avec search bar
Ligne 559-607  → Section tour categories
Ligne 609-878  → Section packages
Ligne 880-903  → Section video banner
Ligne 905-1003 → Section partners + about us
Ligne 1005-1119→ Section featured packages
Ligne 1121-1212→ Section testimonials
Ligne 1214-1316→ Section FAQ
Ligne 1318-1454→ Section blog
Ligne 1456-1503→ Section instagram feed
Ligne 1505-1669→ FooterComponent     (shared)
```

---

## CONFIGURATION TAILWIND — tailwind.config.js EXACT

Copie exacte de arid-main/tailwind.config.js, seul le `content` change :

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],  // ← Seul changement pour Angular
  theme: {
    screens: {
      'xs': '480px', 'sm': '576px', 'md': '768px',
      'lg': '992px', 'xl': '1200px', '2xl': '1400px',
    },
    fontFamily: {
      sans: ['Jost', 'sans-serif'],
      cursive: ['Satisfy', 'cursive'],
      serif: ['Playfair Display', 'serif'],
      bootstarp: ['bootstrap-icons'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px', sm: '12px', lg: '1rem',
        xl: '1rem', '2xl': '5rem'
      },
    },
    fontSize: {
      xxs:["8px"], xs:["12px"], sm:["14px"], base:["16px"],
      md:["18px"], "2md":["20px"], lg:["24px"], xl:["30px"],
      "2xl":["35px"], "3xl":["40px",{lineHeight:"1.5"}],
      "4xl":["48px"], "5xl":["56px"], "6xl":["72px"], "7xl":["80px"]
    },
    extend: {
      backgroundImage: {
        'footer-border': "linear-gradient(90deg, rgba(53,53,53,0) 0%, rgba(53,53,53,0.8) 48.96%, rgba(53,53,53,0) 100%)",
      },
      colors: {
        primary: { "1":"#E8604C", "2":"#eb7766", "3":"#F7DCB5" },
        secondary: { "1":"#FF7C5B", "2":"#FFB29E" },
        dark: {
          "base":"#1E1E1E","1":"#030415","2":"#353535",
          "3":"#5B5B5B","4":"#7B7B7B","5":"#EBEBEB","6":"#F3F3F3"
        },
        status: {
          "info":"#219FFF","info-shad":"#E9F6FF",
          "success":"#17BD8D","success-shad":"#E9FBF6",
          "warning":"#FFC233","warning-shad":"#FFF9EB",
          "danger":"#F53D6B","danger-shad":"#FFE3EB",
        },
        stock: { "1":"#DDDDDD","2":"#EEEEEE" },
        gradient: { "1":"linear-gradient(152.97deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.12) 100%)" }
      },
      zIndex: { 'minus':'-1', 1:'1', 2:'2', 3:'3', 999:'999' },
      lineHeight: {
        '1':'1','1.1':'1.1','1.2':'1.2','1.3':'1.3','1.35':'1.35',
        '1.4':'1.4','1.45':'1.45','1.5':'1.5','1.6':'1.6',
        '1.7':'1.7','1.8':'1.8','1.9':'1.9',
      },
      spacing: {
        'base':'30px','17':'70px','30':'120px',
        'right-container':'calc((100% - 1176px) / 2)',
      },
      boxShadow: {
        'custom-1':'8px 5px 45px rgba(0,0,0,0.08)',
        'custom-2':'4px 3px 40px rgba(16,33,34,0.06)'
      },
      keyframes: {
        paluse: {
          '0%, 100%': { transform:'rotate(-3deg)' },
          '50%': { transform:'rotate(3deg)' },
        }
      },
      animation: { paluse:'2s ease-in-out 0.5s infinite' },
      transformOrigin: {
        'top-left-1/3-3/4':'60% 121%',
        'left-center':'left center',
      },
    },
  },
  plugins: [],
}
```

---

## STYLES — src/styles.css Angular

```css
/* Coller EXACTEMENT le contenu de arid-main/src/input.css */
/* NE RIEN MODIFIER — copie intégrale */

@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Satisfy&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* puis tout le reste de input.css à partir de @layer base ... */
```

---

## ANGULAR.JSON — Assets et scripts exacts

```json
"assets": ["src/favicon.ico", "src/assets"],
"styles": [
  "src/assets/css/animate.css",
  "src/assets/css/bootstrap-icons.min.css",
  "src/assets/css/daterangepicker.css",
  "src/assets/css/fancybox.min.css",
  "src/assets/css/jarallax.css",
  "src/assets/css/leaflet.css",
  "src/assets/css/select2.min.css",
  "src/assets/css/swiper-bundle.min.css",
  "src/styles.css"
],
"scripts": [
  "src/assets/js/moment.min.js",
  "src/assets/js/swiper-bundle.min.js",
  "src/assets/js/jarallax.min.js",
  "src/assets/js/wow.min.js",
  "src/assets/js/fancybox.min.js",
  "src/assets/js/leaflet.min.js",
  "src/assets/js/SplitText.min.js",
  "src/assets/js/daterangepicker.min.js",
  "src/assets/js/select2.min.js"
]
```

---

## STRUCTURE ANGULAR À CRÉER

```
src/
├── assets/
│   ├── css/     ← Copier arid-main/dist/assets/css/ (SAUF styles.css)
│   ├── fonts/   ← Copier arid-main/dist/assets/fonts/
│   ├── images/  ← Copier arid-main/dist/assets/images/
│   └── js/      ← Copier arid-main/dist/assets/js/ SAUF jquery*.js et jquery-ui.js
├── app/
│   ├── shared/
│   │   └── components/
│   │       ├── header/header.component.ts|html
│   │       ├── footer/footer.component.ts|html
│   │       ├── preloader/preloader.component.ts|html
│   │       └── breadcrumb/breadcrumb.component.ts|html
│   ├── features/
│   │   ├── home/
│   │   ├── about/
│   │   ├── circuits/
│   │   ├── destinations/
│   │   ├── booking/
│   │   ├── guides/
│   │   ├── gallery/
│   │   ├── blog/
│   │   ├── faq/
│   │   ├── auth/
│   │   ├── contact/
│   │   └── not-found/
│   ├── app.routes.ts
│   └── app.config.ts
└── styles.css
```

---

## RÈGLES DE CONVERSION — STRICTES

### ❶ Contenu — NE RIEN TOUCHER
- Tous les textes restent en anglais tels quels dans Arid
- Toutes les images src restent identiques (ex: ./assets/images/... → assets/images/...)
- Toutes les données hardcodées (prix, noms, descriptions) restent intactes
- NE PAS remplacer par des données Cameroun Aventure

### ❷ HTML — Copie fidèle
- Copier le HTML de chaque section EXACTEMENT tel qu'il est dans le fichier .html
- Seuls les attributs techniques changent :
  ```
  href="page.html"      → routerLink="/route"
  src="./assets/..."    → src="assets/..."
  href="./assets/..."   → href="assets/..."
  ```
- Toutes les classes Tailwind et classes custom (btn_primary__v1, nav-link, etc.) restent identiques

### ❸ jQuery → Angular (les 7 remplacements)

```
1. PRELOADER fadeOut
   jQuery : $(".preloader").delay(1600).fadeOut("slow")
   Angular: showPreloader = true
            ngOnInit() { setTimeout(() => this.showPreloader = false, 1600) }
            Template: *ngIf="showPreloader" sur le div.preloader

2. STICKY HEADER au scroll
   jQuery : $(window).scroll(() => { $(".header-style").addClass("sticky") })
   Angular: @HostListener('window:scroll') onScroll() { this.isScrolled = window.scrollY > 50 }
            Template: [class.sticky]="isScrolled" sur header.header-style

3. MOBILE MENU toggle
   jQuery : $('.toggle').click(function(e) { ... })
   Angular: isMobileMenuOpen = false
            toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen }
            Template: (click)="toggleMobileMenu()" + [class.open]="isMobileMenuOpen"

4. TABS
   jQuery : $('.tab-link').click(fn) + addClass/removeClass active
   Angular: activeTab = 'tab-1'
            setTab(id: string) { this.activeTab = id }
            Template: (click)="setTab('tab-1')" + [class.active]="activeTab==='tab-1'"

5. SELECT2
   jQuery : $('.destination-select').select2()
   Angular: <select class="destination-select"> natif Angular
            Garder la classe select2 pour le style CSS

6. DATERANGEPICKER
   jQuery : $('input[name="daterange"]').daterangepicker({...})
   Angular: Garder daterangepicker comme librairie vanilla JS
            Initialiser dans ngAfterViewInit() avec declare var $: any
            OU remplacer par deux <input type="date">

7. PRICE SLIDER (jQuery UI)
   jQuery : $("#slider-range").slider({ range:true, min:0, max:500 })
   Angular: <input type="range" [(ngModel)]="priceMin">
            <input type="range" [(ngModel)]="priceMax">
```

### ❹ Librairies JS — initialisation dans ngAfterViewInit

```typescript
declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;
declare var Fancybox: any;

ngAfterViewInit(): void {
  // Copier EXACTEMENT la config du main.js original pour chaque Swiper
  // Ex hero swiper, packages swiper, testimonials swiper...
  new WOW().init();
  jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 });
  Fancybox.bind('[data-fancybox]', {});
}
```

### ❺ Structure des composants — standalone

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Propriétés pour les remplacements jQuery uniquement
  showPreloader = true;
  isScrolled = false;
  isMobileMenuOpen = false;
  activeTab = 'tab-1';

  ngOnInit(): void {
    setTimeout(() => this.showPreloader = false, 1600);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit(): void {
    // Initialisation Swiper, WOW, Jarallax ici
  }
}
```

### ❻ Composants partagés — Header et Footer extraits

Header et Footer apparaissent dans TOUTES les pages Arid.
Les extraire en composants partagés une seule fois :
- `shared/components/header/` ← lignes 41-308 de n'importe quel .html
- `shared/components/footer/` ← lignes 1505-1669 de n'importe quel .html
- `shared/components/preloader/` ← lignes 30-39
- `shared/components/breadcrumb/` ← section breadcrumb de package-list.html

Ensuite dans chaque page :
```html
<app-preloader />
<app-header />
<!-- contenu spécifique à la page -->
<app-footer />
```

---

## APP.ROUTES.TS

```typescript
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component') },
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
  { path: 'auth', loadComponent: () => import('./features/auth/auth.component') },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component') },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component') },
];
```

---

## ORDRE DE GÉNÉRATION — RESPECTER EXACTEMENT

```
ÉTAPE 1 — Setup
  ├── tailwind.config.js
  ├── angular.json (assets + scripts + styles)
  └── src/styles.css (copie de arid-main/src/input.css)

ÉTAPE 2 — Composants partagés
  ├── shared/components/preloader/
  ├── shared/components/header/    ← extraire lignes 41-308 de index.html
  ├── shared/components/footer/    ← extraire lignes 1505-1669 de index.html
  └── shared/components/breadcrumb/

ÉTAPE 3 — Routing
  └── app.routes.ts + app.config.ts

ÉTAPE 4 — Homepage (priorité absolue)
  └── features/home/home.component (toutes les 13 sections)

ÉTAPE 5 — Circuits
  ├── features/circuits/circuit-list.component
  └── features/circuits/circuit-detail.component

ÉTAPE 6 — Booking + Auth
  ├── features/booking/booking.component
  └── features/auth/auth.component

ÉTAPE 7 — Destinations + Guides
  ├── features/destinations/
  └── features/guides/

ÉTAPE 8 — Contenu secondaire
  └── gallery, blog, faq, about, contact, not-found
```

---

## VALIDATION APRÈS CHAQUE COMPOSANT

Vérifie systématiquement :
[ ] Aucun import jQuery ($, .click, .toggle, .fadeOut, .addClass)
[ ] Toutes les classes CSS Arid sont préservées telles quelles
[ ] Le contenu original Arid est intact (pas de texte Cameroun Aventure)
[ ] Les librairies JS (Swiper, WOW, Jarallax) sont dans ngAfterViewInit
[ ] Le composant est standalone avec les bons imports Angular
[ ] src="./assets/" → src="assets/" corrigé partout
[ ] href="*.html" → routerLink="/route" corrigé partout

---

## COMMANDE DE DÉMARRAGE

```bash
# Vérifier que les fichiers sont bien là
ls arid-original/arid-main/dist/*.html
ls arid-original/arid-main/dist/assets/js/
cat arid-original/arid-main/src/input.css

# Puis commencer par :
# 1. Lire index.html en entier
# 2. Générer tailwind.config.js
# 3. Générer src/styles.css
# 4. Extraire Header et Footer en composants partagés
```

