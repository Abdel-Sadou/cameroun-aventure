import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { BookingDetail } from '../../core/models/booking.model';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-detail.component.html',
})
export class BookingDetailComponent implements OnInit {
  booking: BookingDetail | null = null;
  isLoading = true;
  isCancelling = false;
  cancelError = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ref = this.route.snapshot.paramMap.get('reference');
    if (!ref) { this.router.navigate(['/client-space']); return; }

    this.bookingService.getByReference(ref).subscribe({
      next: (data) => { this.booking = data; this.isLoading = false; },
      error: () => this.router.navigate(['/client-space/my-bookings'])
    });
  }

  canCancel(): boolean {
    return this.booking?.status === 'PENDING' || this.booking?.status === 'CONFIRMED';
  }

  onCancel(): void {
    if (!this.booking || !this.canCancel()) return;
    if (!confirm('Confirmer l\'annulation de cette réservation ?')) return;

    this.isCancelling = true;
    this.bookingService.cancel(this.booking.id, 'Annulation à la demande du client').subscribe({
      next: () => this.router.navigate(['/client-space/my-bookings']),
      error: (err) => {
        this.isCancelling = false;
        this.cancelError = err.error?.message || 'Impossible d\'annuler. Contactez-nous.';
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING':     'text-yellow-700 bg-yellow-50 border-yellow-200',
      'CONFIRMED':   'text-blue-700 bg-blue-50 border-blue-200',
      'IN_PROGRESS': 'text-teal-700 bg-teal-50 border-teal-200',
      'COMPLETED':   'text-green-700 bg-green-50 border-green-200',
      'CANCELLED':   'text-gray-500 bg-gray-50 border-gray-200',
      'EXPIRED':     'text-red-600 bg-red-50 border-red-200',
    };
    return map[status] || 'text-dark-3 bg-gray-50 border-gray-200';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING':     'En attente',
      'CONFIRMED':   'Confirmée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED':   'Terminée',
      'CANCELLED':   'Annulée',
      'EXPIRED':     'Expirée',
    };
    return labels[status] || status;
  }

  getPaymentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'DEPOSIT':  'Acompte',
      'BALANCE':  'Solde',
      'FULL':     'Paiement complet',
      'REFUND':   'Remboursement',
    };
    return labels[type] || type;
  }

  getPaymentStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PAID':    'text-green-700 bg-green-50',
      'PENDING': 'text-yellow-700 bg-yellow-50',
      'FAILED':  'text-red-600 bg-red-50',
    };
    return map[status] || 'text-dark-3 bg-gray-50';
  }
}
