import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PreloaderComponent } from '../preloader/preloader.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, PreloaderComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  isScrolled = false;
  isMobileMenuOpen = false;
  showAIModal = false;
  isHomePage = true;
  openDropdowns: Set<number> = new Set();

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isHomePage = e.urlAfterRedirects === '/';
        this.isMobileMenuOpen = false;
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(index: number): void {
    if (this.openDropdowns.has(index)) {
      this.openDropdowns.delete(index);
    } else {
      this.openDropdowns.add(index);
    }
  }

  isDropdownOpen(index: number): boolean {
    return this.openDropdowns.has(index);
  }
}
