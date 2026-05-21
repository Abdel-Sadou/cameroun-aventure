import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreloaderComponent } from '../../shared/components/preloader/preloader.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../shared/components/header/header.component';

declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;
declare var Fancybox: any;

@Component({
  selector: 'app-home-parallax',
  standalone: true,
  imports: [CommonModule, RouterLink, PreloaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './home-parallax.component.html'
})
export class HomeParallaxComponent implements OnInit, AfterViewInit {
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }

    if (typeof jarallax !== 'undefined') {
      jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 });
    }

    if (typeof Fancybox !== 'undefined') {
      Fancybox.bind('[data-fancybox]', {});
    }

    if (typeof Swiper !== 'undefined') {
      new Swiper('.package-three-slider', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        navigation: {
          nextEl: '.pack-next',
          prevEl: '.pack-prev',
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        },
      });

      new Swiper('.testimonial-slider-three', {
        slidesPerView: 1,
        loop: true,
        navigation: {
          nextEl: '.testi-prev',
          prevEl: '.testi-next',
        },
      });

      new Swiper('.insta-feed-slider', {
        slidesPerView: 2,
        spaceBetween: 0,
        loop: true,
        breakpoints: {
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
        },
      });
    }
  }
}
