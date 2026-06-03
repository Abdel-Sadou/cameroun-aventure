import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isScrolled = false;
  isMobileMenuOpen = false;
  isHomePage = true;
  showAIModal = false;
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

  get isLoggedIn(): boolean { return this.authService.isLoggedIn; }
  logout(): void { this.authService.logout(); }
}
