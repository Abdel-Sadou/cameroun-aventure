import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/home/home-dark.component').then(m => m.HomeDarkComponent) },
      { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
      { path: 'circuits', loadComponent: () => import('./features/circuits/circuit-list.component').then(m => m.CircuitListComponent) },
      { path: 'circuits/sidebar', loadComponent: () => import('./features/circuits/circuit-list-sidebar.component').then(m => m.CircuitListSidebarComponent) },
      { path: 'circuits/detail-1', loadComponent: () => import('./features/circuits/circuit-detail.component').then(m => m.CircuitDetailComponent) },
      { path: 'circuits/detail-2', loadComponent: () => import('./features/circuits/circuit-detail-2.component').then(m => m.CircuitDetail2Component) },
      { path: 'circuits/detail-3', loadComponent: () => import('./features/circuits/circuit-detail-3.component').then(m => m.CircuitDetail3Component) },
      { path: 'circuits/:slug', loadComponent: () => import('./features/circuits/circuit-detail.component').then(m => m.CircuitDetailComponent) },/*
      { path: 'destinations', loadComponent: () => import('./features/destinations/destination-list.component').then(m => m.DestinationListComponent) },*//*
      { path: 'destinations/detail', loadComponent: () => import('./features/destinations/destination-detail.component').then(m => m.DestinationDetailComponent) },
      { path: 'destinations/:slug', loadComponent: () => import('./features/destinations/destination-detail.component').then(m => m.DestinationDetailComponent) },*/
      { path: 'booking', loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent) },
      { path: 'guides', loadComponent: () => import('./features/guides/guide-list.component').then(m => m.GuideListComponent) },
      /*{ path: 'gallery', loadComponent: () => import('./features/gallery/gallery.component').then(m => m.GalleryComponent) },
      *//*{ path: 'blog', loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent) },*//*
      { path: 'blog/detail', loadComponent: () => import('./features/blog/blog-detail.component').then(m => m.BlogDetailComponent) },
      { path: 'blog/:slug', loadComponent: () => import('./features/blog/blog-detail.component').then(m => m.BlogDetailComponent) },*/
      { path: 'faq', loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent) },
      { path: 'auth', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
      { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
      { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) },
    ]
  },
];
