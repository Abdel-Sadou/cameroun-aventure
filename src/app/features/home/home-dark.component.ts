import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CircuitService } from '../../core/services/circuit.service';
import { DestinationService } from '../../core/services/destination.service';
import { CircuitSummary } from '../../core/models/circuit.model';
import { DestinationSummary } from '../../core/models/destination.model';
import { getImageUrl, CIRCUIT_FALLBACK_IMAGES, DESTINATION_FALLBACK_IMAGES } from '../../core/utils/image.utils';

declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;
declare var Fancybox: any;

@Component({
  selector: 'app-home-dark',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-dark.component.html'
})
export class HomeDarkComponent implements OnInit, AfterViewInit {

  private circuitService = inject(CircuitService);
  private destinationService = inject(DestinationService);

  circuits: CircuitSummary[] = [];
  destinations: DestinationSummary[] = [];
  isLoadingCircuits = true;
  isLoadingDestinations = true;

  activeFaq: number | null = null;

  ngOnInit(): void {
    this.circuitService.getFeatured().subscribe({
      next: (data) => {
        this.circuits = data;
        this.isLoadingCircuits = false;
        this.reinitPackageSwiper();
      },
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
    if (typeof WOW !== 'undefined') { new WOW().init(); }
    if (typeof jarallax !== 'undefined') { jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 }); }
    if (typeof Fancybox !== 'undefined') { Fancybox.bind('[data-fancybox]', {}); }
    if (typeof Swiper !== 'undefined') {
      new Swiper('.hero-slider-two', {
        slidesPerView: 1,
        loop: true,
        effect: 'fade',
        autoplay: { delay: 5000 },
        navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
      });
      new Swiper('.testimonial-slider-two', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.testi-two-pagi', clickable: true },
      });
      new Swiper('.insta-feed-slider', {
        slidesPerView: 2,
        loop: true,
        breakpoints: { 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 992: { slidesPerView: 5 } },
      });
    }
  }

  private reinitPackageSwiper(): void {
    setTimeout(() => {
      if (typeof Swiper !== 'undefined' && this.circuits.length > 0) {
        new Swiper('.package-two-slider', {
          slidesPerView: 1,
          loop: true,
          autoplay: { delay: 4000 },
          pagination: { el: '.pack-two-pagi', clickable: true },
          breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
        });
      }
    }, 150);
  }

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  isFaqOpen(index: number): boolean {
    return this.activeFaq === index;
  }

  getCircuitImage(circuit: CircuitSummary): string {
    return getImageUrl(circuit.coverImage,
      CIRCUIT_FALLBACK_IMAGES[circuit.slug] || 'assets/images/packages/p2-1.webp');
  }

  getDestinationImage(dest: DestinationSummary): string {
    return getImageUrl(dest.coverImage,
      DESTINATION_FALLBACK_IMAGES[dest.slug] || 'assets/images/destination/d1-1.webp');
  }
}
