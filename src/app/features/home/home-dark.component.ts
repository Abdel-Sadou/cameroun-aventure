import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreloaderComponent } from '../../shared/components/preloader/preloader.component';

declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;
declare var Fancybox: any;

@Component({
  selector: 'app-home-dark',
  standalone: true,
  imports: [CommonModule, RouterLink, PreloaderComponent],
  templateUrl: './home-dark.component.html'
})
export class HomeDarkComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  openDropdowns: Set<number> = new Set();
  activeFaq: number | null = null;

  ngOnInit(): void {}

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

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  isFaqOpen(index: number): boolean {
    return this.activeFaq === index;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      new Swiper('.package-two-slider', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.pack-two-pagi', clickable: true },
        breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
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
}
