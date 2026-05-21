import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreloaderComponent } from '../../shared/components/preloader/preloader.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;
declare var Fancybox: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PreloaderComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  activeFaq: number | null = null;

  ngOnInit(): void {}

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  isFaqOpen(index: number): boolean {
    return this.activeFaq === index;
  }

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
      new Swiper('.destination-slider-one', {
        slidesPerView: 2,
        spaceBetween: 12,
        loop: true,
      });

      new Swiper('.partner-swiper', {
        slidesPerView: 3,
        spaceBetween: 0,
        loop: true,
        speed: 3000,
        autoplay: { delay: 0, disableOnInteraction: false },
        breakpoints: {
          768: { slidesPerView: 4 },
          992: { slidesPerView: 6 },
        },
      });

      new Swiper('.testimonial-slider-one', {
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
