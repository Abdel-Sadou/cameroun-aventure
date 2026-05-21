import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  openDropdowns: Set<number> = new Set();

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
