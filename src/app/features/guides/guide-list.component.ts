import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guide-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './guide-list.component.html'
})
export class GuideListComponent {}
