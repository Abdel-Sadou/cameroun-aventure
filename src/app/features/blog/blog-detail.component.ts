import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreloaderComponent } from '../../shared/components/preloader/preloader.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, PreloaderComponent, HeaderComponent, FooterComponent],
  templateUrl: './blog-detail.component.html'
})
export class BlogDetailComponent {}
