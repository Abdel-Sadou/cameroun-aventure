import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destination-list.component.html'
})
export class DestinationListComponent {}
