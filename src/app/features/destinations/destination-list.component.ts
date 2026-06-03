import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DestinationService } from '../../core/services/destination.service';
import { DestinationSummary } from '../../core/models/destination.model';
import { getImageUrl, DESTINATION_FALLBACK_IMAGES } from '../../core/utils/image.utils';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination-list.component.html'
})
export class DestinationListComponent implements OnInit {

  private destinationService = inject(DestinationService);

  destinations: DestinationSummary[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.destinationService.getAll().subscribe({
      next: (page) => { this.destinations = page.content; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  getImage(dest: DestinationSummary): string {
    return getImageUrl(dest.coverImage,
      DESTINATION_FALLBACK_IMAGES[dest.slug] || 'assets/images/destination/d1-1.webp');
  }
}
