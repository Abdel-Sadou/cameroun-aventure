import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';
import { CircuitDetail, DepartureDate } from '../../core/models/circuit.model';
import { getImageUrl, CIRCUIT_FALLBACK_IMAGES } from '../../core/utils/image.utils';

declare var Swiper: any;
declare var WOW: any;
declare var Fancybox: any;

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './circuit-detail.component.html'
})
export class CircuitDetailComponent implements OnInit, AfterViewInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private circuitService = inject(CircuitService);

  circuit: CircuitDetail | null = null;
  departureDates: DepartureDate[] = [];
  isLoading = true;
  activeTab = 'booking';

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
      next: (dates) => this.departureDates = dates,
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') new WOW().init();
    if (typeof Fancybox !== 'undefined') Fancybox.bind('[data-fancybox]', {});
    if (typeof Swiper !== 'undefined') {
      new Swiper('.package-detail-slider', {
        slidesPerView: 1,
        loop: true,
        navigation: { nextEl: '.detail-next', prevEl: '.detail-prev' },
      });
    }
  }

  setTab(tab: string): void { this.activeTab = tab; }

  getMainImage(): string {
    return getImageUrl(
      this.circuit?.coverImage,
      this.circuit?.slug ? CIRCUIT_FALLBACK_IMAGES[this.circuit.slug] : 'assets/images/packages/p1-1.webp'
    );
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { OPEN: 'Ouvert', FULL: 'Complet', WAITLIST: 'Liste d\'attente', CLOSED: 'Fermé' };
    return map[status] || status;
  }
}
