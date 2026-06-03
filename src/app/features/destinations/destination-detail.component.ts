import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DestinationService } from '../../core/services/destination.service';
import { CircuitService } from '../../core/services/circuit.service';
import { DestinationDetail } from '../../core/models/destination.model';
import { CircuitSummary } from '../../core/models/circuit.model';
import { getImageUrl, DESTINATION_FALLBACK_IMAGES, CIRCUIT_FALLBACK_IMAGES } from '../../core/utils/image.utils';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination-detail.component.html'
})
export class DestinationDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destinationService = inject(DestinationService);
  private circuitService = inject(CircuitService);

  destination: DestinationDetail | null = null;
  circuits: CircuitSummary[] = [];
  isLoading = true;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.router.navigate(['/destinations']); return; }

    this.destinationService.getBySlug(slug).subscribe({
      next: (data) => {
        this.destination = data;
        this.isLoading = false;
        this.loadCircuits(data.id);
      },
      error: () => this.router.navigate(['/destinations'])
    });
  }

  private loadCircuits(destinationId: string): void {
    this.circuitService.search({ destinationId, size: 6 }).subscribe({
      next: (page) => this.circuits = page.content,
      error: () => {}
    });
  }

  getDestinationImage(): string {
    return getImageUrl(
      this.destination?.coverImage,
      this.destination?.slug ? DESTINATION_FALLBACK_IMAGES[this.destination.slug] : 'assets/images/destination/d1-1.webp'
    );
  }

  getCircuitImage(circuit: CircuitSummary): string {
    return getImageUrl(circuit.coverImage,
      CIRCUIT_FALLBACK_IMAGES[circuit.slug] || 'assets/images/packages/p1-1.webp');
  }
}
