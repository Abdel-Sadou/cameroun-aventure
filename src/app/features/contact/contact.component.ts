import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var Swiper: any;
declare var WOW: any;
declare var jarallax: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') new WOW().init();
    if (typeof jarallax !== 'undefined') jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 });
    if (typeof Swiper !== 'undefined') {
      new Swiper('.insta-feed-slider', {
        slidesPerView: 2,
        loop: true,
        breakpoints: { 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 992: { slidesPerView: 5 } },
      });
    }
  }
}
