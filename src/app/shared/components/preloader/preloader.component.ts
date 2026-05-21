import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.component.html'
})
export class PreloaderComponent implements OnInit {
  showPreloader = true;

  ngOnInit(): void {
    setTimeout(() => this.showPreloader = false, 1600);
  }
}
