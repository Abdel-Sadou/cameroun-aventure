import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CircuitService } from '../../core/services/circuit.service';
import { CircuitSummary, CircuitSearchRequest } from '../../core/models/circuit.model';
import { getImageUrl, CIRCUIT_FALLBACK_IMAGES } from '../../core/utils/image.utils';

declare var Swiper: any;
declare var WOW: any;

@Component({
  selector: 'app-circuit-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './circuit-list.component.html'
})
export class CircuitListComponent implements OnInit, AfterViewInit {

  private circuitService = inject(CircuitService);
  private route = inject(ActivatedRoute);

  circuits: CircuitSummary[] = [];
  totalPages = 0;
  currentPage = 0;
  isLoading = true;

  filters: CircuitSearchRequest = { page: 0, size: 9 };

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filters.category = params['category'];
      if (params['region']) this.filters.region = params['region'];
      this.loadCircuits();
    });
  }

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') { new WOW().init(); }
    if (typeof Swiper !== 'undefined') {
      new Swiper('.insta-feed-slider', {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: false,
        breakpoints: { 320: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }
      });
    }
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
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  getCircuitImage(circuit: CircuitSummary): string {
    return getImageUrl(circuit.coverImage,
      CIRCUIT_FALLBACK_IMAGES[circuit.slug] || 'assets/images/packages/p1-1.webp');
  }

  getDifficultyLabel(d: string): string {
    const map: Record<string, string> = { EASY: 'Facile', MODERATE: 'Modéré', HARD: 'Difficile', VERY_HARD: 'Très difficile' };
    return map[d] || d;
  }
}
