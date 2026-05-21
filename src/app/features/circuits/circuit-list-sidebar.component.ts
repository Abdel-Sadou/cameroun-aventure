import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreloaderComponent } from '../../shared/components/preloader/preloader.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

declare var WOW: any;

@Component({
  selector: 'app-circuit-list-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PreloaderComponent, HeaderComponent, FooterComponent],
  templateUrl: './circuit-list-sidebar.component.html'
})
export class CircuitListSidebarComponent implements OnInit, AfterViewInit {
  priceMin = 0;
  priceMax = 500;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') new WOW().init();
  }
}
