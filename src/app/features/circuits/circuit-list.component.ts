import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var Swiper: any;
declare var WOW: any;

@Component({
  selector: 'app-circuit-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './circuit-list.component.html'
})
export class CircuitListComponent implements OnInit, AfterViewInit {
  priceMin = 0;
  priceMax = 500;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }

    if (typeof Swiper !== 'undefined') {
      // Instagram feed slider
      new Swiper('.insta-feed-slider', {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: false,
        breakpoints: {
          320: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3
          },
          1024: {
            slidesPerView: 4
          },
          1280: {
            slidesPerView: 5
          }
        }
      });
    }
  }
}
