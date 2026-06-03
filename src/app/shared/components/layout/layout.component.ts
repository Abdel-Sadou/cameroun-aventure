import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreloaderComponent } from '../preloader/preloader.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PreloaderComponent, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {}
