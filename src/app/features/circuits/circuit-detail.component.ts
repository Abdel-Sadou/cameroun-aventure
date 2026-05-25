import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  activeTab = 'overview';

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {}

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
}
